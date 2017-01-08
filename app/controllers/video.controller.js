const User         = apprequire('models/user.model')
const Video        = apprequire('models/video.model')
const Comment      = apprequire('models/comment.model')
const Group        = apprequire('models/group.model')
const Channel      = apprequire('models/channel.model')
const VideoLike    = apprequire('models/video-like.model')
const VideoView    = apprequire('models/video-view.model')
const Defaults     = apprequire('helpers/defaults.helper')
const Utils        = apprequire('helpers/utils.helper')
const ObjectId     = require('mongoose').Types.ObjectId

const Errors       = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const Abilities    = apprequire('helpers/abilities.helper')

class VideoController {
	constructor() {}

	allForGroup(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let sort = { date: 'desc' }

		Video.find({ group: groupId }).sort(sort).exec()
		.then(videos => Video.sanitizeVideoForDisplay(user, videos))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res))
	}
	
	get(req, res) { 
		let user = req.user
		let videoId = req.params.videoId

		Video.findById(videoId).exec()
		.then(video => Video.sanitizeVideoForDisplay(user, video))
		.then(video => res.status(200).json(video))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will insert one / more videos (same video) to the database
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {number}     			201: success
	 */
	new(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let body = req.body

		this._checkRequiredProperties(body)
		.then(() => {
			let channelIds = body.channels.map(channel => ObjectId(channel))

			let query = [
				{ $match: { _id: { $in: channelIds } } },
				{ $group: { 
					_id: "$group",
					members: { $addToSet: "$members" },
					channels: { $push: "$_id" },
				} }
			]

			return Channel.aggregate(query)//.find({_id: { $in: channelIds }}).sort({ group: 1 }).exec()
		}).then(groups => {
			let groupIds = groups.map(group => group._id)

			return Promise.all([groups, Group.find({ _id: { $in: groupIds }, members: user })])
		}).then(results => {
			let groups   = results[0]
			let validIds = results[1].map(g => g._id.toString())

			if(validIds.length !== groups.length) { throw new Errors.Forbidden('There are some groups in the list that user does not belong.') }

			let videos = []
			for (let group of groups) {
				if (validIds.indexOf(group._id)) {
					let video = new Video(body.video)
					video.group = group._id
					video.channels = group.channels
					video.owner = user
					video.date = new Date()

					videos.push(video.save())
				}
			}

			return Promise.all(videos)
		}).then(() => res.sendStatus(201))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will verify if the required params to perform the POST videos are on the body
	 * @param  {Object} body Contains the properties to be saved on the database
	 * @return {Promise}      If resolve, means everything is validated
	 */
	_checkRequiredProperties(body){
	return new Promise((resolve, reject) => {
		if (!body.video || !body.channels) { throw new Errors.BadRequest('MISSING_REQUIRED_PROPERTIES')}
		resolve()
	})
	}

	edit(req, res) {
		let user    = req.user
		let videoId = req.params.videoId
		let video   = req.body

		Video.findById(videoId).populate('group channels')
		.then(videoFound => {
			if(!videoFound) throw new Errors.NotFound()
			return Abilities.can(user, 'edit', videoFound)
		})
		.then(videoFound =>{		
			video = Video.sanitizeVideoForEditing(video)
			return Video.findByIdAndUpdate(videoId, video)
		})
		.then(() => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will delete the selected video
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {Array}      			204
	 */
	delete(req, res) {
		let user    = req.user
		let videoId = req.params.videoId

		Video.findById(videoId).populate('group channels')
		.then(video => {
			if(!video) throw new Errors.NotFound()
			return Abilities.can(user, 'delete', video)
		})
		.then(() => Video.removeWithRelated(videoId))
		.then(() => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	like(req, res) {
		let videoId = req.params.videoId
		let user    = req.user

		let videoLike   = new VideoLike()
		videoLike.video = videoId
		videoLike.owner = user
		videoLike.date  = new Date()

		videoLike.save()
		.then(saved => { 
			let query = { $push: { likes: videoLike } }
			return Video.findByIdAndUpdate(videoId, query).exec()
		})
		.then(() => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	unlike(req, res) {
		let videoId = req.params.videoId
		let user    = req.user

		VideoLike.findOne({ video: videoId, owner: user }).exec()
		.then(videoLike => {
			if(!videoLike) throw new Errors.NotFound()
			
			let query = { $pull: { likes: videoLike._id } }
			return Promise.all([
				Video.findByIdAndUpdate(videoId, query),
				VideoLike.findOneAndRemove(videoLike._id)
			])
		})
		.then(() => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	allLikesForVideo(req, res) {
		let videoId = req.params.videoId
		let sort = { date: 'desc' }
		let populate = 'owner'

		VideoLike.find({ video: videoId }).sort(sort).populate(populate).exec()
		.then(videoLikes => res.status(200).json(videoLikes))
		.catch(err => ErrorHandler.toRequest(err, res)) 
	}

	view(req, res) {
		let videoId = req.params.videoId
		let user = req.user

		let videoView   = new VideoView()
		videoView.video = videoId
		videoView.owner = user
		videoView.date  = new Date()

		videoView.save()
		.then(saved => { 
			let query = { $push: { views: videoView } }
			return Video.findByIdAndUpdate(videoId, query).exec()
		})
		.then(() => res.sendStatus(200))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	allViewsForVideo(req, res) {
		let videoId = req.params.videoId
		let sort = { date: 'desc' }
		let populate = 'owner'

		VideoView.find({ video: videoId }).sort(sort).populate(populate).exec()
		.then(videoViews => res.status(200).json(videoViews))
		.catch(err => ErrorHandler.toRequest(err, res)) 
	}

	/**
	 * Will retrieve all videos based in a channel ID
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {Array}      			Contains an array of videos, paginated and sorted by newest
	 */
	list(req, res) {
		let user = req.user
		let channelId = req.params.channelId
		let sort = req.query.sort
		let page = req.query.page || 1
		let itemsPerPage = Defaults.app.maxItensPerPage

		Video.listAllForChannel(channelId, page, itemsPerPage)
		.then(videos => Video.sanitizeVideoForDisplay(user, videos))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res)) 
	}
}

module.exports = VideoController
