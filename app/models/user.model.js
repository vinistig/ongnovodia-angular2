/**
 * USER
 * Represents a user on the database. It mirrors information
 * from bluepages to avoid a Bluepages call for every request
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const objectId = mongoose.Types.ObjectId

const Faces       = require('ibm-bluemix-faces')
const Group       = apprequire('models/group.model')
const Channel     = apprequire('models/channel.model')
const Errors      = apprequire('helpers/errors.helper')
const hasObjectId = apprequire('helpers/has-object-id.helper')
const Kaltura     = apprequire('models/kaltura.model')

/* model schema */

const schema = new Schema({
	name:   { type: String, require: true, unique: true },
	username:     { type: String, required: true, unique: false },
	password:    { type: String ,required: true },
	isAdmin: { type: Boolean, required: true, default: false }
})

schema.index({ name: 'text', username: 'text', password: 'text' })

/* statics */

schema.statics.verifyUserAndPassword = function(user) {
console.log(user)
return new Promise((resolve, reject) => {
	this.findOne({'username': user.username}).then(result =>{
		console.log(result)
		if(result != null){
			let realPassword = result.password
			let userPassword = user.password
			if(realPassword === userPassword ){
				var res = {};
				res.name = result.name
				res.username = result.username
				resolve(res)
			} else{
				reject({"erro":401,"message":"INVALID_PASSWORD"})
			}
		} else {
			reject({"erro":401,"message":"INVALID_USERNAME"})
		}
	}).catch(err => reject(err))
})

}
/**
 * Gets a user from uid. If found, will update its
 * infod with the lates from Faces. If not, will
 * create it.
 * @param  {String} uid Uid to look for
 * @return {Promise, User}
 */
schema.statics.getOrUpdateFromUid = function(uid) {
return new Promise((resolve, reject) => {
	Promise.all([
		this.findOne({'username': uid}),
		//Faces.query(uid)
	])
	.then(query => {
		let user    = query[0]
		let face    = query[1][0]

		if(!face) throw new Errors.UidNotFound(uid)
		let userObj = this.mapFacesUser(face)

		if (!user) {
			user = this.findOne({'email': userObj.email})
		}

		return Promise.all([
			user,
			userObj
		])
	})
	.then(query => {
		let user    = query[0]
		let userObj = query[1]
		let kaltura = new Kaltura()

		if(!user) {
			user = new this(userObj)
		} else {
			user.name = userObj.name
			user.email = userObj.email
			user.uid = userObj.uid
		}

		return Promise.all([
			user,
			kaltura.addUser(user)
		])
	})
	.then(query => {
		let user = query[0]

		user.hasKalturaSession = true
		return user.save()
	})
	.then(user => resolve(user))
	.catch(err => reject(err))
})
}

/**
 * Replaces and array of uids with an array of Users.
 * Ignores any entries that are objects or ObjetcId
 * @param  {Array} uids Uids to replace
 * @return {Promise, [ObjectId]}
 */
schema.statics.replaceUidsWithUsers = function(uids) {
return new Promise((resolve, reject) => {
	if(!uids) resolve()

	let usersToGet = []
	let alreadyUsers = []
	uids = (Array.isArray(uids)) ? uids : [uids]

	for(uid of uids) {
		if(objectId.isValid(uid))
			alreadyUsers.push(uid)
		else if (typeof uid === 'object' && uid._id)
			alreadyUsers.push(uid)
		else if (typeof uid === 'object' && uid.uid)
			usersToGet.push(this.getOrUpdateFromUid(uid.uid))
		else
			usersToGet.push(this.getOrUpdateFromUid(uid))
	}

	Promise.all(usersToGet)
	.then(users => resolve(alreadyUsers.concat(users)))
	.catch(err => reject(err))
})
}

/**
 * Maps an user from IBM LDAP server into a User model
 * compliant one
 * @param  {Object} user The user returned by LDAP
 * @return {Object}
 */
schema.statics.mapLdapUser = function(user) {
	return { uid: user.uid, name: user.cn, email: user.mail }
}

/**
 * Maps an user from a Faces search into a User model
 * compliant one
 * @param  {Object} user The user returned by Faces
 * @return {Object}
 */
schema.statics.mapFacesUser = function(user) {
	return { uid: user.uid, name: user.name, email: user.email }
}

/**
 * Get all permissions for a given user
 * @param  {User} user Who to lookup permissions for
 * @return {Promise, Object}
 */
schema.statics.getPermissionsFor = function(user) {
return new Promise((resolve, reject) => {
	let tree = {
		isAdmin: user.isAdmin,
		groups: []
	}

	Promise.all([
		Group.find({ owners: user }),
		Channel.find({ managers: user })
	])
	.then(query => {
		let groups   = query[0]
		let channels = query[1]

		for(group of groups) {
			let groupPermissions = {
				groupId: group.id,
				isOwner: hasObjectId(group.owners, user._id),
				channels: []
			}
			tree.groups.push(groupPermissions)
		}

		let groupsReference = tree.groups.map(g => g.groupId)

		for(channel of channels) {
			let groupIndex = groupsReference.indexOf(channel.group.toString())
			if(groupIndex === -1) continue

			let channelPermissions = {
				channelId: channel.id,
				isManager: hasObjectId(channel.managers, user._id),
				isModerator: hasObjectId(channel.moderators, user._id),
				isExecutive: hasObjectId(channel.executives, user._id)
			}
			tree.groups[groupIndex].channels.push(channelPermissions)
		}

		resolve(tree)
	})
	.catch(err => reject(err))
})
}

schema.statics.getOrCreateFromEmail = function(email){
return new Promise((resolve, reject) => {
	this.findOne({'email': email})
	.then(user => {
		if(!user) {
			user = new this({ email: email, isAdmin: false, hasKalturaSession: false }) }

		return user.save()
	})
	.then(user => resolve(user))
	.catch(err => reject(err))
})
}


module.exports = mongoose.model('User', schema)
