/**
 * VIDEO LIKE
 * A like on a video. It's stored as a separate object to be
 * easily removed or added from a video.
 * A user can have only one like in a give video.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.ObjectId

const schema = new Schema({
	date: { type: Date, required: true },

	owner: { type: ObjectID, ref: 'User', required: true },
	video: { type: ObjectID, ref: 'Video', required: true }
})

schema.index({ owner: 1, video: 1 }, { unique: true })

module.exports = mongoose.model('VideoLike', schema)
