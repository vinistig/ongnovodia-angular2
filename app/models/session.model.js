/**
 * SESSION
 * Any login will create a new session, which will have a token.
 * The token will be exchanged by the app and the API to identify
 * the user and its valid session.
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const uuid     = require('uuid')

const schema = new Schema({
	token:     { type: String, required: true },
	type:      { type: String, required: true },
	createdAt: { type: Date, required: true },
	user:      { type: ObjectID, ref: 'User', required: true }
})


/* statics */


schema.statics.createFromUid = function(uid, type = 'mobile') {
return new Promise((resolve, reject) => {
	const User = apprequire('models/user.model')

	User.getOrUpdateFromUid(uid)
	.then(user => {
		let session = new this()
		session.user = user
		session.type = type
		session.createdAt = new Date()
		session.token = uuid.v4()
		
		return session.save()
	})
	.then(session => resolve(session))
	.catch(err => reject(err))
})
}

module.exports = mongoose.model('Session', schema)
