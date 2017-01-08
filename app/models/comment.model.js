/**
 * COMMENT
 * Users can leave comments on videos
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const Video    = apprequire('models/video.model')

const schema = new Schema({
	comment: { type: String, required: true },
	date: { type: Date, required: true },

	video:  { type: ObjectID, ref: 'Video', required: true },
	author: { type: ObjectID, ref: 'User', required: true }
})


/* middleware */


/**
 * Add the comment to the video when saving it
 * @param  {Comment} doc The comment being inserted
 */
schema.post('save', function(doc) {
	let query = { $push: { comments: this } }
	Video.findByIdAndUpdate(this.video, query).exec()
})


/* static */


/**
 * Removes a comment from a video. This is done with
 * a static rather than a middleware because middleware
 * doesn't get called when doing findByIdAndRemove()
 * @param  {ObjectId} videoId   The video to pull the comment from
 * @param  {ObjectId} commentId The comment to be pulled
 */
schema.statics.removeFromVideo = function(videoId, commentId) {
	let query = { $pull: { comments: commentId } }
	return Video.findByIdAndUpdate(videoId, query).exec()
}

/**
 * Will sanitize the result of the comments
 * @param  {Array<Comment>} 	comments 	Contains all comments to be returned to the front
 * @return {Array<Comment>}     			All Comments
 */
schema.statics.sanitizeComments = function(comments) {
const Utils = apprequire('helpers/utils.helper')

return new Promise((resolve, reject) => {
	comments = comments.map(comment => {
		comment._doc.time = Utils.getRelativeTime(comment.date)
		return comment
	})

	resolve(comments)
})
}


module.exports = mongoose.model('Comment', schema)
