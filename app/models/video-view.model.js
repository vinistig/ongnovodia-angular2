/**
 * VIDEO VIEW
 * A view on a video. It's stored as a separate object to be
 * easily removed or added from it.
 * A user can have many views on a video, but each is unique.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.ObjectId

const schema = new Schema({
	date: { type: Date, required: true },

	owner: { type: ObjectID, ref: 'User', required: true },
	video: { type: ObjectID, ref: 'Video', required: true }
})


module.exports = mongoose.model('VideoView', schema)
