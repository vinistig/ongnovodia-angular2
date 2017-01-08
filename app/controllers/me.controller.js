const User         = apprequire('models/user.model')
const Group        = apprequire('models/group.model')
const Channel      = apprequire('models/channel.model')
const Video        = apprequire('models/video.model')
const ObjectId     = require('mongoose').Types.ObjectId
const Error        = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const Utils        = apprequire('helpers/utils.helper')
const Defaults	   = apprequire('helpers/defaults.helper')
const moment       = require('moment')

class MeController {
	constructor() {}

	/**
	 * Will retrieve all groups that user is member
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {Array}      			Contains an array of groups from the user logged
	 */
	index(req, res) {
		let user = req.user
		let query = { members: user }
		let fields = 'name _id description'
		let theseGroups
		let groupIds

		Group.find(query).select(fields).sort('name').exec()
		.then(groups => {
			if(!groups === 0) { throw new Error.NotFound() }

			theseGroups = groups
			groupIds = groups.map(group => group.id)
			let groupObjectIds = groups.map(group => group._id)

			//Creates a query to return the total of videos
			let query = [
				{ $match: { group: { $in: groupObjectIds }, owner: user._id } },
				{ $group: {
					_id: '$group',
					count: { $sum: 1  },
				}}
			]

			return Video.aggregate(query).exec()
		}).then(totals => {
			for (let total of totals){
				theseGroups[groupIds.indexOf(total._id.toString())]._doc.totalVideos = total.count
			}

			res.status(200).json(theseGroups)
		}).catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will return all videos related with an specific group the user is member
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {Array}      			Contains an array with all videos of the group
	 */
	getVideos(req, res){
		let user         = req.user
		let groupId      = req.params.groupId

		let page         = req.query.page || 1
		let itemsPerPage = Defaults.app.maxItensPerPage
		let skip         = ((page - 1) * itemsPerPage)

		Video.find({ group: groupId, owner: user }).sort({ date: -1, _id: -1 })
		.skip(skip).limit(itemsPerPage)
		.then(videos => Video.sanitizeVideoForDisplay(user, videos))
		.then(videos => res.status(200).json(videos))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will retrieve all groups and channels that user is member
	 * @param  {Express.Request} req 	Store the request information
	 * @param  {Express.Request} res 	Store the response information
	 * @return {Array}      			Contains an array of groups and channels from the user logged
	 */
	getGroupsAndChannels(req, res){
		let user       = req.user
		let getPrivate = (req.query.private==="true" || req.query.private===true) ? true : false
		let theseGroups
		let groupIds
		let result

		console.log(getPrivate);

		let promises = [
			Group.find({ members: user }).sort('name').select('name description').exec(),
			Channel.findAllForGroupMember(user)
		]

		Promise.all(promises)
		.then(groupsAndChannels => {
			let groups = groupsAndChannels[0]
			let channels = groupsAndChannels[1]

			if(groups.length === 0) { throw new Error.NotFound() }
			if(channels.length === 0) { throw new Error.NotFound() }

			theseGroups = groups
			groupIds = groups.map(group => group.id)
			let groupObjectIds = groups.map(group => group._id)
			
			//Build the final object with channels information
			for (let channel of channels){
				let index = groupIds.indexOf(channel.group.id)
				if (index > -1) {
					if (!Array.isArray(theseGroups[index]._doc.channels)) { theseGroups[index]._doc.channels = [] }

					channel._doc.isSubscribed = Utils.isMember(user, channel.subscribers)
					channel._doc.isExecutive = Utils.isMember(user, channel.executives)
				
					delete channel._doc.subscribers
					delete channel._doc.executives
					delete channel._doc.group

					if(getPrivate || channel._doc.isExecutive) {
						theseGroups[index]._doc.channels.push(channel)
					} else {
						if (!channel.isPrivate) {
							theseGroups[index]._doc.channels.push(channel)
						}
					}
				}
			}

			res.status(200).json(theseGroups)
		}).catch(err => ErrorHandler.toRequest(err, res))
	}

	permissions(req, res) {
		let user = req.user
		let tree = {}

		User.getPermissionsFor(user)
		.then(permissions => res.status(200).json(permissions))
		.catch(err => ErrorHandler.toRequest(err, res))
	}
}

module.exports = MeController
