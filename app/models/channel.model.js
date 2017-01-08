/**
 * CHANNEL
 * A channel users can subscribe to. It belongs to a group
 * and can have videos related to it
 */
const mongoose    = require('mongoose')
const Schema      = mongoose.Schema
const ObjectID    = Schema.ObjectId
const hasObjectId = apprequire('helpers/has-object-id.helper')

const schema = new Schema({
	name:        { type: String, required: true },
	description: { type: String },
	isPrivate:   { type: Boolean, required: true },
	isPrimary:   { type: Boolean, required: true },

	group:       { type: ObjectID, ref: 'Group', required: true },
	executives:  [{ type: ObjectID, ref: 'User' }],
	managers:    [{ type: ObjectID, ref: 'User' }],
	moderators:  [{ type: ObjectID, ref: 'User' }],
	subscribers: [{ type: ObjectID, ref: 'User' }]
})


/* statics */


/**
 * Find the ObjectIds of the groups a user is a manager
 * for at least one channel
 * @param  {User} user The user to look for
 * @return {Promise, [ObjectId]}
 */
schema.statics.findGroupsFromManagedChannels = function(user) {
return new Promise((resolve, reject) => {	
	this.find({ $or:[ { managers: user._id }, { moderators: user._id } ] })
	.then(managedChannels => { 
		let managedChannelsGroups = managedChannels.map(c => c.group)
		resolve(managedChannelsGroups)
	})
	.catch(err => reject(err))
})
}

/**
 * Will retrieve the total of the videos grouped by channel
 * @param  {Array<Channel>} channels The channels to consult
 * @return {Array<Channel>}          The channels with totals
 */
schema.statics.getVideoAndSubscriberTotals = function(channels) {
return new Promise((resolve, reject) => {
	const Video = apprequire('models/video.model')
	
	let channelIds = (Array.isArray(channels)) ? channels.map(channel => channel._id) : channels._id

	Video.getTotalVideoByChannel(channelIds)
	.then(videos => {
		if (Array.isArray(channels)) {
			let channelIds = videos.map(video => video._id.toString())
			channels = channels.map(channel => {
				let indexTotal = channelIds.indexOf(channel._id.toString())

				channel._doc.subsCount = (Array.isArray(channel.subscribers)) ? channel.subscribers.length : 0
				channel._doc.videoCount = (indexTotal > -1) ? videos[indexTotal].count : 0

				return channel
			})
		} else {
			channels._doc.subsCount = (Array.isArray(channels.subscribers)) ? channels.subscribers.length : 0
			channels._doc.videoCount = (videos.length > 0) ? videos[0].count : 0
		}

		resolve(channels)
	}).catch(err => reject(err))
})
}

/**
 * Find all channels a user is either a manager, or
 * owner of the group
 * @param  {Group} group Group to pull the channels from
 * @param  {User}  user  The user to look for
 * @return {Promise, [Channel]}
 */
schema.statics.findAllFor = function(group, user) {
return new Promise((resolve, reject) => {
	let query
	let toPopulate = 'moderators managers executives'

	if(user.isAdmin || hasObjectId(group.owners, user._id))
		query = {group: group}
	else
		query = {group: group, managers: user}

	this.find(query).populate(toPopulate).exec()
	.then(channels => this.getVideoAndSubscriberTotals(channels))
	.then(channels => resolve(channels))
	.catch(err => reject(err))
})
}

/**
 * Find all channels a user is either member
 * @param  {Group} group Group to pull the channels from
 * @param  {User}  user  The user to look for
 * @return {Promise, [Channel]}
 */
schema.statics.findAllForGroupMember = function(user) {
	const Group       = apprequire('models/group.model')

	return new Promise((resolve, reject) => {
		let query = { members: user }
		Group.find(query).exec()
			.then(groups => {
				let toPopulate = 'group executives'
				let toSelect = 'group name description isPrivate subscribers executives'
				let groupIds = groups.map(group => group.id)
				let query = {group: {$in: groupIds}}
				let sort = {'group': 1, 'name': 1}
				
				return this.find(query).populate(toPopulate).select(toSelect).sort(sort).exec()
			})
			.then(channels => resolve(channels))
			.catch(err => reject(err))
	})
	
}

/**
 * Destroy the relationship with video if there is more than one channel / remove the video and its related if there is only one channel
 * @param  {string} 	channelId 	The id of the channel
 * @return {Promise}           		Resolves if success
 */
schema.statics.removeWithRelated = function(channelId){
return new Promise((resolve, reject) => {
	const Video = apprequire('models/video.model')

	this.findOneAndRemove({ _id: channelId }).exec()
		.then(() => Video.find({ channels: channelId }).exec())
		.then(videos => {
			let toUpdate = { $pull: { channels: channelId } }
			
			let promises = []
			for (let video of videos) {
				if (video.channels.length > 1) {
					promises.push(Video.findByIdAndUpdate(video._id.toString(), toUpdate).exec())
				} else { 
					//If there is only one channel means is the one we are removing the channel, then removes the video as well.
					promises.push(Video.removeWithRelated(video._id.toString()))
				}
			}

			return Promise.all(promises)
		}).then(() => resolve())
		.catch((err) => reject(err))
})
}


module.exports = mongoose.model('Channel', schema)
