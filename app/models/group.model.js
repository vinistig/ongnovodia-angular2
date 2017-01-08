/**
 * GROUP
 * It's the main unity of the app, and all is related to it. Groups
 * dictate who an access the app, and which content they can see.
 * A user can belong to more than one group.
 */
const mongoose    = require('mongoose')
const Schema      = mongoose.Schema
const ObjectId    = Schema.ObjectId
const objectId    = mongoose.Types.ObjectId
const Channel     = apprequire('models/channel.model')
const Validators  = apprequire('helpers/validators.helper')
const hasObjectId = apprequire('helpers/has-object-id.helper')

const schema = new Schema({
	name: { type: String, unique: true, required: true },
	// TODO: Length should be under 255 chars
	description: { type: String, required: true },

	owners: { type: [{ type: ObjectId, ref: 'User' }], 
		validate: [v => v.length >= 1, 'Group needs at least 1 owner'] },
	members: [{ type: ObjectId, ref: 'User' }],
	tempUsers: [{ type: ObjectId, ref: 'User' }]
})

/* methods */


/**
 * Sets the Group owners from a list of uids
 * @param {Array} uids Uids to get users from
 * @return {Promise}
 */
schema.methods.setOwnersByUid = function(uids) {
return new Promise((resolve, reject) => {
	const User = apprequire('models/user.model')

	User.replaceUidsWithUsers(uids)
	.then(owners => { 
		this.owners = owners
		resolve(owners)
	})
	.catch(err => reject(err))
})
}

/**
 * Get all channels from a group for a user
 * @param  {User} user Who to find the channels for
 * @return {Promise, [Channel]}
 */
schema.methods.channelsFor = function(user) {
	let query
	if(user.isAdmin || hasObjectId(this.owners, user._id))
		query = { group: this }
	else
		query = { group: this, managers: user }

	return Channel.find(query).exec()
}

/* static */
/**
 * Removes the group and it's related documents
 * @param  {string} 	groupId 	Contains the Id of the group
 * @return {Promise}         		Resolves if success
 */
schema.statics.removeWithRelated = function(groupId) {
	const Video 	   = apprequire('models/video.model')
	const Comment      = apprequire('models/comment.model')
	const VideoLike    = apprequire('models/video-like.model')
	const VideoView    = apprequire('models/video-view.model')

return new Promise((resolve, reject) => {
	this.findOneAndRemove({ _id: groupId }).exec()
		.then(() => Channel.find({ group: groupId }).remove().exec())
		.then(() => Video.find({ group: groupId }).exec())
		.then(videos => {
			let videosIds = videos.map(video => video._id)
			let query = {video: { $in: videosIds }}

			let promises = [
				Video.find({ group: groupId }).remove().exec(),
				Comment.find(query).remove().exec(),
				VideoView.find(query).remove().exec(),
				VideoLike.find(query).remove().exec()
			]
			
			return Promise.all(promises)
		}).then(() => resolve())
		.catch((err) => reject(err))
})	
}

/**
 * Removes a user from the temp list and move its
 * User reference into the members
 * @param  {Group} group Group to promote the user
 * @param  {User}  user  User to be promoted
 * @return {Promise}
 */
schema.statics.promoteFromTemp = function(group, user) {
return new Promise((resolve, reject) => {
	const User = apprequire('models/user.model')

	User.findOne({ email: user.email })
	.then(docUser => {
		let query = { $pull: { tempUsers: docUser._id }, $push: { members: docUser._id } }

		return Promise.all([query, User.findByIdAndUpdate(docUser._id, user) ])
	}).then((query) => this.findByIdAndUpdate(group._id, query[0]).exec())
	.then(group => resolve(group))
	.catch(err => reject(err))
})	
}

/**
 * Remove a user from the temp list
 * @param  {Group}  group Group to remove the user from
 * @param  {String} email Email to be removed
 * @return {Promise}
 */
schema.statics.removeFromTemp = function(group, email) {
return new Promise((resolve, reject) => {
	const User = apprequire('models/user.model')

	User.findOne({email: email}).exec()
	.then(user => {
		let query = { $pull: { tempUsers: user._id } }

		return this.findByIdAndUpdate(group._id, query).exec()
	}).then(group => resolve(group))
	.catch(err => reject(err))
})
}

/**
 * Find all groups related to the user, either
 * through being a group owner or managing a channel
 * inside the gorup
 * @param  {User} user User to find groups for
 * @return {Promise, [Group]}
 */
schema.statics.findRelatedToUser = function(user) {
const Video = apprequire('models/video.model')

return new Promise((resolve, reject) => {	
	Channel.findGroupsFromManagedChannels(user)
	.then(manageChannelsGroups => { 
		let filter = (user.isAdmin) ? {} : { $or:[
			{ _id: { $in: manageChannelsGroups }},
			{ owners: user._id } 
		]}
			
		return this.find(filter).populate('owners').exec() 
	})
	.then(groups => {
		let groupIds = groups.map(group => group._id)
		let query = [
			{ $match: { group: { $in: groupIds } } },
			{ $group: {
				_id: '$group',
				count: { $sum: 1  },
			}}
		]
		return Promise.all([
			groups, 
			Video.aggregate(query).exec(),
			Channel.aggregate(query).exec(),
		])
	})
	.then(results => {
		let groups = results[0]
		let videoTotals = results[1]
		let videoTotalsIds = videoTotals.map(vt => vt._id.toString())
		let channelsTotals = results[2]
		let channelsTotalsIds = channelsTotals.map(ct => ct._id.toString())

		groups = groups.map(group => {
			let totalMembers = (Array.isArray(group.members)) ? group.members.length : 0
			let totalTempUsers = (Array.isArray(group.tempUsers)) ? group.tempUsers.length : 0

			indexTotal = videoTotalsIds.indexOf(group._id.toString())
			indexChannel = channelsTotalsIds.indexOf(group._id.toString())

			group._doc.videoCount = (indexTotal > -1) ? videoTotals[indexTotal].count : 0
			group._doc.channelCount = (indexChannel > -1) ? channelsTotals[indexChannel].count : 0
			group._doc.userCount = totalMembers + totalTempUsers

			return group
		})

		resolve(groups)
	})
	.catch(err => reject(err))
})
}

module.exports = mongoose.model('Group', schema)
