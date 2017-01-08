const Group        = apprequire('models/group.model')
const Channel      = apprequire('models/channel.model')
const Video        = apprequire('models/video.model')
const Error        = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')

class FeedController {
	constructor() {}

	index(req, res) {
		let user = req.user
		let sort = req.query.sort
		let page = req.query.page || 1
		let itemsPerPage = 20
		let aggregate    = ''

		Group.find({ members: user }).exec()
		.then(groups => {
			let groupsIds = groups.map(g => g._id)


			return Channel.find({ $and: [{ group: { $in: groupsIds } }, { $or: [{ subscribers: user }, { isPrimary: true }] }] })
		}).then(channels => {
			let theseChannels = {
				ids: [],
				isPrimary: []
			}

			theseChannels.ids = channels.map(c => {
				if (c.isPrimary === true) { theseChannels.isPrimary.push(c._id) }
				return c._id
			})

			switch(sort) {
				case 'likes':
				case 'views':
					aggregate = 'doc.'
					return Video.mostForType(sort, theseChannels.ids, 'channels', page, itemsPerPage)
				case 'oldest':
					aggregate = ''
					return this._getOldestVideos(theseChannels.ids, page, itemsPerPage)
				case 'newest':
				case undefined:
				case '':
					aggregate = 'doc.'
					return Video.newest(theseChannels.ids, theseChannels.isPrimary, page, itemsPerPage)
				default:
					throw new Error.NotFound('SORT_NOT_FOUND: ' + sort)
			}
		})
		.then(videos => Video.sanitizeVideoForDisplay(user, videos, aggregate))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	allForGroup(req, res) {
		let user         = req.user
		let sort         = req.query.sort
		let page         = req.query.page || 1
		let itemsPerPage = 20
		let skip         = (page - 1) * itemsPerPage
		let aggregate    = ''

		Group.find({ members: user }).exec()
		.then(groups => {
			let groupsIds = groups.map(g => g._id)
			switch(sort) {
				case 'likes':
				case 'views':
					aggregate = 'doc.'
					return Video.mostForType(sort, groupsIds, 'group', page, itemsPerPage)
				case 'oldest':
					aggregate = ''
					return Video.find({ group: { $in: groupsIds } }).sort({ date: 1 })
					       .skip(skip).limit(itemsPerPage)
				case 'newest':
				case undefined:
				case '':
					aggregate = ''
					return Video.find({ group: { $in: groupsIds } }).sort({ date: -1 })
					       .skip(skip).limit(itemsPerPage)
				default:
					throw new Error.NotFound('SORT_NOT_FOUND: ' + sort)
			}
		})
		.then(videos => Video.sanitizeVideoForDisplay(user, videos, aggregate))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err ,res))
	}


	/* private */


	_getOldestVideos(channelsIds, page, itemsPerPage) {
		let query = { channels: { $in: channelsIds } }
		let sort  = { date: 1 }
		let skip  = (page -1) * itemsPerPage

		return Video.find(query).sort(sort).skip(skip).limit(itemsPerPage)
	}

}

module.exports = FeedController;
