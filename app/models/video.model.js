/**
 * VIDEO
 * The content basis for the app, to which all content gravitates.
 * No video file is stored on this app, but rather on Kaltura. Its 
 * reference is stored in this document, which can provide the app
 * a link to access it.
 * It can have many comments, views and likes.
 * It needs to belong to one, but can belong to many channels.
 * It can only belong to one single group.
 */
const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Errors = apprequire('helpers/errors.helper')
const Utils  = apprequire('helpers/utils.helper')

const schema = new Schema({
	title:        { type: String, required: true },
	date:         { type: Date, required: true },
	description:  { type: String, required: true },
	tags:         { type: [String] },
	duration:     { type: Number, required: true },
	thumbnailUrl: { type: String, required: true },
	entryId:      { type: String, required: true },

	owner:    { type: ObjectId, ref: 'User', required: true },
	group:    { type: ObjectId, ref: 'Group', required: true },
	channels: [{ type: ObjectId, ref: 'Channel' }], // required at least 1
	comments: [{ type: ObjectId, ref: 'Comment' }],
	likes:    [{ type: ObjectId, ref: 'VideoLike' }],
	views:    [{ type: ObjectId, ref: 'VideoView' }]
})

schema.index({ title: 'text', description: 'text', tags: 'text' });

schema.path('channels').validate(function(value) {
  return value.length;
},"videos need at least one channel")

/* statics */


/**
 * Will return a list of videos sorted by the bigger
 * count of the specified type
 * @param  {String} type The type to search form, which needs to 
 *                       be an array and stored property of the Video
 * @param  {[type]} ids  The ids to match the from object
 * @param  {String} from Where to pull videos from
 * @return {Promise, [Video]}
 */
schema.statics.mostForType = function(type, ids, from = 'channels', page = 1, itemsPerPage = 20) {
return new Promise((resolve, reject) => {
	if(!type) throw new TypeError('MISSING_SORT_TYPE')

	let skip = ((page - 1) * itemsPerPage)
	let query = [
		{ $match: { [from]: { $in: ids } } },
		{ $group: { 
			_id: '$_id',
			[from]: { $push: '$'+from },
			size: { $sum: { $size: '$'+type }  },
			doc: { $push: '$$ROOT' }
		}},
		{ $sort: { size: -1 , _id: 1 } },
		{ $skip: skip },
		{ $limit: itemsPerPage }
	]

	this.aggregate(query).exec()
	.then(videos => resolve(videos))
	.catch(err => reject(err))
})
}

schema.statics.newest = function(channelIds, primaryChannels, page = 1, itemsPerPage = 20){
	let skip = ((page - 1) * itemsPerPage)
	let query = [
		{ "$match": {
			"channels": {
				"$in": channelIds
			}
		} },
		{ $project: {
			isPrimary: { $cond: {
				if: { $setIsSubset: [[true],
						{ "$map": {
                        "input": "$channels",
                        "as": "el",
                        "in": { $setIsSubset: [["$$el"], primaryChannels] } }
                    	} 
					] },
				then: { $add: [ "$date", 3*24*60*60000 ] },
				else: "$date" 
			} },
			doc: ["$$ROOT"],
		} },
		{ $sort: { isPrimary: -1 , _id: 1 } },
		{ $skip: skip },
		{ $limit: itemsPerPage }
	]

	return this.aggregate(query)
}

/**
 * Will prepare the video object with properties needed on the front-end
 * @param  {User} 			user   		An object of model User
 * @param  {Array<Video>} 	videos 		An array of objects of model Video
 * @param  {Array<Video>} 	aggregate 	If is 'doc.' means the results came from an aggregation instead find
 * @return {Array<Video>}        		An array of objects of model Video with requested properties to be used on frontend
 */
schema.statics.sanitizeVideoForDisplay = function(user, videos, aggregate = '') {
return new Promise((resolve, reject) => {
	let path = aggregate + 'likes'
	//I did not use promise.all here because I need the same object update at the end and not one array of objects
	//because if I do this way I will have to implements alot of loopings over the arrays / documents to do assign an overwrite most update positions
	//to then iterates over the final object to rewrite the fields, so is to many loopings.			
	this.populate(videos, {path: path, model: 'VideoLike'})
	.then(videos => {
			path = aggregate + 'channels'

			return this.populate(videos, {path: path, select: {_id: 1, name: 1, managers: 1}, model: 'Channel'})
		}).then(videos => {
			path = aggregate + 'group'

			return this.populate(videos, {path: path, select: {_id: 1, name: 1, owners: 1}, model: 'Group'})
		}).then(videos => {
			path = [
				aggregate+'likes.owner',
				'owner'
			]

			return this.populate(videos, {path: path.join(' ' + aggregate), select: {uid: 1, name: 1}, model: 'User'})
		}).then(videos => {
			if (!Array.isArray(videos)) {
				videos = [videos]
			}
			
			videos = videos.map(video => {
				if (video.doc) {
					video = this.setComputedProperties(user, video.doc[0])
				} else if (video._doc) {
					video._doc = this.setComputedProperties(user, video._doc)
				} else {
					video = this.setComputedProperties(user, video)
				}
				
				return video
			})

			resolve(videos)
		})
		.catch(err => reject(err))
})
}

/**
 * Populates the computed fileds to return the object with the new fields
 * @param {User} 	user  	Contains an object of model User
 * @param {Video} 	video 	Contains an object of model Video
 */
schema.statics.setComputedProperties = function(user, video) {
	video.isLiked = Utils.isLiked(user, video.likes)
	video.canEdit = Utils.canEditVideo(user, video)
	video.views = video.views.length
	video.likes = video.likes.length
	video.comments = video.comments.length
	video.time = Utils.getRelativeTime(video.date)
	delete video.__v

	video.group = {
			_id: video.group._id,
			name: video.group.name
	}

	video.channels = video.channels.map(channel => {
		return {
			_id: channel._id,
			name: channel.name
		}
	})



	return video
}

schema.statics.sanitizeVideoForEditing = function(video) {
	let sanitizedVideo = {}

	if(video.title)
		sanitizedVideo.title = video.title
	if(video.description)
		sanitizedVideo.description = video.description
	if(video.tags)
		sanitizedVideo.tag = video.tags

	// Video needs to have at least one channel
	if(video.channels && Array.isArray(video.channels) && video.channels.length > 0)
		sanitizedVideo.channels = video.channels
	else if(video.channels)
		throw new Errors.BadRequest('Video needs at least one channel')

	return sanitizedVideo
}

/**
 * Will return a list of videos from a channel sorted by the newest 
 * count of the specified type
 * @param  {String} channelId The Id of the channel
 * @return {Promise, [Video]}
 */
schema.statics.listAllForChannel = function(channelId, page, itemsPerPage) {
return new Promise((resolve, reject) => {
	if(!page || !itemsPerPage) { throw new TypeError('MISSING_PAGINATION_PARAMS') }

	let skip = ((page - 1) * itemsPerPage)

	this.find({ channels: channelId }).sort({date: -1, _id: -1})
	.skip(skip).limit(itemsPerPage).exec()
		.then(videos => resolve(videos))
		.catch(err => reject(err))
})
}

/**
 * Will return remove all documents related with the video
 * @param  {String} videoId The Id of the video to be removed
 * @return {Promise}		resolve if everything works fine
 */
schema.statics.removeWithRelated = function(videoId) {
const Comment      = apprequire('models/comment.model')
const VideoLike    = apprequire('models/video-like.model')
const VideoView    = apprequire('models/video-view.model')

return new Promise((resolve, reject) => {
	let query = {video: videoId}
	let promises = [
		Comment.find(query).remove().exec(),
		VideoView.find(query).remove().exec(),
		VideoLike.find(query).remove().exec()
	]

	this.findByIdAndRemove(videoId).exec()
		.then(() => Promise.all(promises))
		.then(() => resolve())
		.catch(err => reject(err))
})
}

/**
 * Will return the total of videos based on channel IDs
 * @param  {Array} channelIds Contains a list of IDs
 * @return {Array}            An array with totals grouped by channel ID
 */
schema.statics.getTotalVideoByChannel = function(channelIds){
	let match = (Array.isArray(channelIds)) ? { $in: channelIds } : channelIds
	
	let query = [
		{ $match: { channels: match } },
		{ $unwind: "$channels" },
		{ $group: {
			_id: '$channels',
			count: { $sum: 1 },
		}},
	]

	return this.aggregate(query).exec()
}

module.exports = mongoose.model('Video', schema)
