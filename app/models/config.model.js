/**
 * CONFIG
 * The system configuration status, mainly versioning the database
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const objectId = mongoose.Types.ObjectId

const schema = new Schema({
	dbVersion: { type: Number, min: 0, required: true, unique: true },
	date: { type: Date, required: true },
	environment: {type: String, required: true}
})


/* statics */

/**
 * Get the latest database version
 * @return {Promise, Config}
 */
schema.statics.getLatest = function(env) {
	return this.findOne({environment: env}).sort({dbVersion: -1}).exec()
}


module.exports = mongoose.model('Config', schema)
