const Channel     = apprequire('models/channel.model')
const Errors      = apprequire('helpers/errors.helper')
const hasObjectId = apprequire('helpers/has-object-id.helper')
const Utils       = apprequire('helpers/utils.helper')

class Abilities {
	constructor() {
		this.rules = {
			'list#Admin':   this.isAdmin,
			'view#Admin':   this.isAdmin,
			'add#Admin':    this.isAdmin,
			'delete#Admin': this.isAdmin,

			'list#Group':         this.isLogged,
			'view#Group':         this.isSomethingOnGroup,
			'add#Group':          this.isAdmin,
			'edit#Group':         this.canEditGroup,
			'delete#Group':       this.canEditGroup,
			'addMember#Group':    this.canEditGroup,
			'removeMember#Group': this.canEditGroup,

			'add#Channel':    this.canEditGroup,
			'list#Channel':   this.isSomethingOnGroup,
			'view#Channel':   this.isSomethingOnChannel,
			'edit#Channel':   this.canEditChannel,
			'remove#Channel': this.canEditChannel,

			'edit#Video': this.canEditVideo,
			'delete#Video': this.canDeleteVideo
		}
	}

	can(user, action, resource, instance) {
	return new Promise((resolve, reject) => {
		let thisInstance
		let thisResource

		if(typeof resource != 'string') {
			if (!resource) throw new TypeError('This Ability must have an instance')
				
			thisInstance = resource
			thisResource = resource.constructor.modelName
		} else {
			thisInstance = instance
			thisResource = resource
		}

		let rule = this.rules[`${action}#${thisResource}`]
		if(!rule) return reject(new Error('ABILITY_RULE_NOT_FOUND'))

		rule(user, thisInstance)
		.then(result => resolve(thisInstance))
		.catch(err => reject(new Errors.Forbidden()))
	})
	}


	/* rules */

	isLogged(user, instance) {
	return new Promise((resolve, reject) => {
		if (user !== undefined) resolve()
		else reject()
	})
	}

	isAdmin(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) resolve()
		else reject()
	})
	}

	isSomethingOnGroup(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) return resolve()

		Channel.find({ group: instance })
		.then(channels => {
			let channelManagers = []

			for(let channel of channels) {
				if(channel.managers) 
					channelManagers = channelManagers.concat(channel.managers)
			}

			if(hasObjectId(instance.owners, user._id)) 
				return resolve()
			if(hasObjectId(channelManagers, user._id))
				return resolve()
			else
				reject()
		})
		.catch(err => reject())
	})
	}

	canEditGroup(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) 
			return resolve()

		if(hasObjectId(instance.owners, user._id))
			return resolve()

		return reject()
	})
	}

	canEditChannel(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) 
			return resolve()

		if(hasObjectId(instance.group.owners, user._id))
			return resolve()

		return reject()
	})	
	}

	isSomethingOnChannel(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) 
			return resolve()

		if(hasObjectId(instance.group.owners, user._id))
			return resolve()

		if(hasObjectId(instance.managers, user._id))
			return resolve()

		if(hasObjectId(instance.moderators, user._id))
			return resolve()

		return reject()
	})
	}

	/**
	 * Will verify if the user has permission to perform this action (Edit)
	 * @param  {object} user     Contains the user information from token
	 * @param  {object} instance Contains the group related with the action
	 * @return {Promise}         Resolves if user has access, rejects if not
	 */
	canEditVideo(user, instance) {
	return new Promise((resolve, reject) => {
		if (Utils.canEditVideo(user, instance)) {
			resolve()
		} else {
			reject()
		}
	})
	}

	/**
	 * Will verify if the user has permission to perform this action (Delete)
	 * @param  {object} user     Contains the user information from token
	 * @param  {object} instance Contains the group related with the action
	 * @return {Promise}         Resolves if user has access, rejects if not
	 */
	canDeleteVideo(user, instance) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin)
			return resolve()
		
		if(instance.owner === user._id)
			return resolve()

		if(instance.group.owner === user._id)
			return resolve()

		let channelsOwnersObjectsIds = instance.channels.map(c => c.managers)
		channelsOwnersObjectsIds = [].concat.apply([], channelsOwnersObjectsIds)
		if(hasObjectId(channelsOwnersObjectsIds, user._id))
			return resolve()


		return reject()
	})
	}
}

const instance = new Abilities()
module.exports = instance
