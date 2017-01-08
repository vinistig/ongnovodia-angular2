const Channel      = apprequire('models/channel.model')
const Group        = apprequire('models/group.model')
const User         = apprequire('models/user.model')
const Error        = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const Abilities    = apprequire('helpers/abilities.helper')

class ChannelController {
	constructor() {}

	index(req, res) {
		let user       = req.user
		let groupId    = req.params.groupId
		let toPopulate = 'moderators managers executives'
		
		Group.findById(groupId)
		.then(group => {
			if(!group) throw new Error.NotFound()
			return Abilities.can(user, 'list', 'Channel', group)
		})
		.then(group => Channel.findAllFor(group, user))
		.then(channels => res.status(200).json(channels))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	new(req, res) {
		let user    = req.user
		let groupId = req.params.groupId
		let body    = req.body

		let channel = new Channel(body)
		channel.group = groupId

		Promise.all([
			Group.findById(groupId),
			Channel.find({ name: body.name, group: groupId })
		])
		.then(query => {
			let group = query[0]
			let channelWithSameName = query[1]

			if(channelWithSameName.length > 0)
				throw new Error.AlreadyExists('A channel with this name exists in this group')
			if(!group) 
				throw new Error.NotFound()

			return Abilities.can(user, 'add', 'Channel', group)
		})
		.then(group => Promise.all([
			User.replaceUidsWithUsers(body.executives),
			User.replaceUidsWithUsers(body.managers),
			User.replaceUidsWithUsers(body.moderators)
		]))
		.then(users => {
			channel.executives = users[0]
			channel.managers   = users[1]
			channel.moderators = users[2]

			return channel.save()
		})
		.then(saved => res.status(201).json([]))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	get(req, res) {
		let user       = req.user
		let channelId  = req.params.channelId
		let toPopulate = 'moderators managers executives group'

		Channel.findById(channelId).populate(toPopulate)
		.then(channel => { 
			if(!channel) throw new Error.NotFound()
			return Abilities.can(user, 'view', channel) 
		})
		.then(channel => Channel.getVideoAndSubscriberTotals(channel))
		.then(channel => res.status(200).json(channel))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	edit(req, res) {
		let user        = req.user
		let channelId   = req.params.channelId
		let groupId     = req.params.groupId
		let body        = req.body
		let toPopulate  = 'moderators managers group'

		this._checkValidProperties(body, ['isPrimary', 'name', 'description'])
		.then(() => {
			let promises = [
				Channel.findById(channelId).populate(toPopulate),
				Channel.find({ name: body.name, group: groupId })
			]

			return Promise.all(promises)
		}).then(query => {
			let channel = query[0]
			let channelWithSameName = query[1]

			if(channelWithSameName.length > 0 && channelWithSameName[0].id !== channelId)
				throw new Error.AlreadyExists('A channel with this name exists in this group')
			if(!channel) 
				throw new Error.NotFound()



			return Abilities.can(user, 'edit', channel)
		})
		.then(channel => {
			let toRemove = ['isPrivate', 'executives', 'managers', 'moderators']
			
			for (let property of toRemove) {
				if (body.hasOwnProperty(property)) { delete body[property] }
			}

			return Channel.findByIdAndUpdate(channelId, body).exec()
		})
		.then(() => res.status(200).json([]))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	updateUsers(req, res) {
		let user        = req.user
		let channelId   = req.params.channelId
		let groupId     = req.params.groupId
		let body        = req.body
		let toPopulate  = 'moderators managers group'
		let types       = ['managers', 'executives']

		if (!body.executives && !body.managers)
			throw new Error.BadRequest('MISSING_UPDATE_PARAMS')


		this._checkValidProperties(body, ['executives', 'managers'])
		.then(() => {
			//filtering duplicated
			for (let type of types){
				let tmpArray    = []
				let tmpArrayUid    = []
				for (let entry of body[type]) {
					if (tmpArrayUid.indexOf(entry.uid) < 0) {
						tmpArray.push(entry)
						tmpArrayUid.push(entry.uid)
					}
				}

				if (tmpArray.length > 0) { body[type] = tmpArray }
			}


			return Channel.findById(channelId).populate(toPopulate)
		}).then(query => {
			let channel = query

			if(!channel) 
				throw new Error.NotFound()

			return Abilities.can(user, 'edit', channel)
		}).then(channel => {
			let toRemove = ['name', 'description', 'isPrivate', 'isPrimary', 'group']
			for (let property of toRemove) {
				if (body.hasOwnProperty(property)) { delete body[property] }
			}

			let promises = []
			for (let type of types) {
				promises.push(User.replaceUidsWithUsers(body[type]))
			}

			return Promise.all(promises)
		}).then(users => {
			for (let index in users) {
				body[types[index]] = users[index]
			}

			return Channel.findByIdAndUpdate(channelId, body).exec()
		})
		.then(() => res.status(200).json([]))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will verify if there is at least one valid filed to update
	 * @param  {object} 	object 		the object with fields to update
	 * @param  {array} 		array  		the array with valid fields to verify
	 * @return {Promise}        		Resolves if has at least one valid property
	 */
	_checkValidProperties(object, array){
	return new Promise((resolve, reject) => {
		let keys = Object.keys(object)

		for (let property of array) {
			if (keys.indexOf(property) >= 0) { resolve() }
		}
		
		throw new Error.BadRequest('MISSING_UPDATE_PARAMS')		
	})
	}

	delete(req, res) {
		let user       = req.user
		let channelId  = req.params.channelId
		let toPopulate = 'moderators managers group'

		Channel.findById(channelId).populate(toPopulate)
		.then(channel => { 
			if(!channel) throw new Error.NotFound()
			return Abilities.can(user, 'remove', channel) 
		})
		.then(channel => Channel.removeWithRelated(channelId))
		.then(() => res.status(200).json([]))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	subscribe(req, res) {
		let channelId = req.params.channelId
		let user      = req.user
		let query     = { $push: { subscribers: user } }

		Channel.findByIdAndUpdate(channelId, query).exec()
		.then(updated => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	unsubscribe(req, res) {
		let channelId = req.params.channelId
		let user      = req.user
		let query     = { $pull: { subscribers: user } }
		
		Channel.findByIdAndUpdate(channelId, query).exec()
		.then(() => res.sendStatus(204))
		.catch(err => ErrorHandler.toRequest(err, res))
	}
}

module.exports = ChannelController
