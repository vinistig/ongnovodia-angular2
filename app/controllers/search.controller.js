const Video        = apprequire('models/video.model')
const User         = apprequire('models/user.model')
const Group        = apprequire('models/group.model')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const Errors       = apprequire('helpers/errors.helper')
const Defaults	   = apprequire('helpers/defaults.helper')

class SearchController {
	constructor() {}

	/**
	 * Will search all videos by title, description or tag name
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {number}     			200: success
	 */
	index(req, res) {
		let user  = req.user
		let query = req.query.q
		let itemsPerPage = Defaults.app.maxItensPerPage
		let sort = req.query.sort || -1
		let page = req.query.page || 1
		let skip = ((page - 1) * itemsPerPage)

		this._validateSearchQuery(query)
		.then(() => Group.find({ members: user }))
		.then(groups => {
			let groupsIds = groups.map(g => g._id)

			let search = {
				$text: { $search: query },
				group: { $in: groupsIds }
			}

			return Video.find(search).sort({date: sort, _id: -1}).skip(skip).limit(itemsPerPage).exec()
		}).then(videos => {
			if (videos.length <= 0) { 
				return []
			} else {
				return videos
			}
		})
		.then(videos => Video.sanitizeVideoForDisplay(user, videos))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will search all videos by author (uid, name, email)
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {number}     			200: success
	 */
	getVideosByAuthor(req, res) {
		let user  = req.user
		let query = req.query.q
		let itemsPerPage = Defaults.app.maxItensPerPage
		let sort = req.query.sort || -1
		let page = req.query.page || 1
		let skip = ((page - 1) * itemsPerPage)

		this._validateSearchQuery(query)
		.then(() => Group.find({ members: user }))
		.then(groups => {
			let groupsIds = groups.map(g => g._id)

			return Promise.all([
				groupsIds, 
				User.find( { $text: { $search: query } } )
			])
		}).then(results => {
			let groupsIds = results[0]
			let authors = results[1]

			if (authors.length <= 0) { 
				return []
			} else {
				query = authors.map(author => author._id)
				let search = { owner: { $in: query}, group: { $in: groupsIds } }
				return Video.find(search).sort({date: sort, _id: -1}).skip(skip).limit(itemsPerPage).exec()
			}			
		})
		.then(videos => Video.sanitizeVideoForDisplay(user, videos))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res))
	}


	/* private */


	_validateSearchQuery(query) {
	return new Promise((resolve, reject) => {
		if(!query) throw new Errors.BadRequest('No query provided')
		else resolve()
	})
	}
}

module.exports = SearchController
