const Group = apprequire('models/group.model')
const User = apprequire('models/user.model')
const Channel = apprequire('models/channel.model')
const Abilities = apprequire('helpers/abilities.helper')
const Error = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const ObjectId = require('mongoose').Types.ObjectId
const hasObjectId = apprequire('helpers/has-object-id.helper')
const CSVHandler = apprequire('helpers/csv.helper')
const Defaults = apprequire('helpers/defaults.helper')

class GroupController {
	constructor() { }

	index(req, res) {
		let user = req.user

		Abilities.can(user, 'list', 'Group')
			.then(can => Group.findRelatedToUser(user))
			.then(groups => res.status(200).json(groups))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	get(req, res) {
		let id = req.params.groupId
		let user = req.user

		Group.findById(id).populate('owners members').exec()
			.then(group => {
				if (!group) throw new Error.NotFound()
				return Abilities.can(user, 'view', group)
			})
			.then(group => Promise.all([
				group,
				group.channelsFor(user)
			]))
			.then(query => {
				let group = query[0]
				let channels = query[1]
				let response = { group, channels }

				res.status(200).json(response)
			})
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	new(req, res) {
		let user = req.user
		let body = req.body

		let group = new Group()
		group.name = body.name
		group.description = body.description

		Abilities.can(user, 'add', 'Group')
			.then(can => group.setOwnersByUid(body.owners))
			.then(ownersSet => group.save())
			.then(saved => res.status(201).json([]))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	edit(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let group = req.body

		Group.findById(groupId)
			.then(groupFound => {
				if (!groupFound) throw new Error.NotFound()
				Abilities.can(user, 'edit', groupFound)
			})
			.then(groupFound => User.replaceUidsWithUsers(group.owners))
			.then(owners => {
				group.owners = owners
				return Group.findByIdAndUpdate(groupId, group).exec()
			})
			.then(edited => res.status(200).json(edited))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	delete(req, res) {
		let user = req.user
		let groupId = req.params.groupId

		Group.findById(groupId)
			.then(groupFound => {
				if (!groupFound) throw new Error.NotFound()
				return Abilities.can(user, 'delete', groupFound)
			})
			.then(groupFound => Group.removeWithRelated(groupId))
			.then(() => res.status(200).json([]))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	allMembers(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let object = {
			rows: 0,
			pageSize: Defaults.admin.maxItensPerPage,
			entries: []
		}

		let page = req.query.page || 1
		let skip = ((page - 1) * object.pageSize)
		let tempMembers


		Group.findById(groupId)
			.then(group => {
				if (!group) throw new Error.NotFound('Group not found')
				return Abilities.can(user, 'view', group)
			})
			.then(group => {
				object.rows = group.members.length + group.tempUsers.length

				let query = {
					$or: [ 
						{ _id: { $in: group.members } }, 
						{ _id: { $in: group.tempUsers } }
					]
				}

				return User.find(query).sort({ name: 1, email: 1 })
					.select('uid name email').skip(skip).limit(object.pageSize).exec()
			}).then(members => {
				members = members.map(entry => {
					if (entry.uid) {
						return entry
					} else {
						return {
							uid: entry.email,
							email: entry.email
						}
					}
				})

				object.entries = members

				res.status(200).json(object)
			})
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	searchForMember(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let q = req.query.q

		this._validateSearchQuery(q)
			.then(() => {
				let search = {
					$text: { $search: q }
				}

				return Promise.all([
					User.find(search).sort({name: 1, email: 1}).exec(),
					Group.findById(groupId)
				])
			})
			.then(query => {
				let users = query[0]
				let group = query[1]

				if (!group)
					throw new Error.NotFound('Group not found')
				if (users.length === 0)
					throw new Error.NotFound(`No user matches ${q}`)

				return Promise.all([
					users,
					group,
					Abilities.can(user, 'view', group),
				])
			})
			.then(query => {
				let users = query[0]
				let group = query[1]
				let usersInGroup = []

				for (let user of users) {
					if (hasObjectId(group.members, user._id) || hasObjectId(group.tempUsers, user._id)) {
						if (user.uid) {
							usersInGroup.push(user)
						} else {
							usersInGroup.push({
								uid: user.email,
								email: user.email
							})
						}
						
					}
				}

				if (usersInGroup.length === 0)
					throw new Error.NotFound(`No user matches ${q}`)

				res.status(200).json({
					rows: usersInGroup.length,
					pageSize: Defaults.admin.maxItensPerPage,
					entries: usersInGroup
				})
			})
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	addOneMember(req, res) {
		let loggedUser = req.user
		let groupId = req.params.groupId
		let uid = req.params.uid

		Promise.all([
			User.getOrUpdateFromUid(uid),
			Group.findById(groupId)
		])
			.then(query => {
				let user = query[0]
				let group = query[1]

				if (!group)
					throw new Error.NotFound('Group not found')
				if (hasObjectId(group.members, user._id))
					throw new Error.AlreadyExists()

				return Promise.all([
					user,
					Abilities.can(loggedUser, 'addMember', group)
				])
			})
			.then(query => {

				let user = query[0]
				let group = query[1]

				let insertQuery = { $push: { members: user } }
				return Group.findByIdAndUpdate(groupId, insertQuery).exec()
			})
			.then(updated => res.status(201).json([]))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	removeOneMember(req, res) {
		let user = req.user
		let uid = req.params.uid
		let groupId = req.params.groupId

		let property = (uid.indexOf("@") > -1) ? 'email' : 'uid'
		let promises = [
			Group.findById(groupId),
			User.findOne({ [property]: uid })
		]

		Promise.all(promises)
			.then(query => {
				property = (property==='uid') ? 'members' : 'tempUsers'
				let group = query[0]
				let userToRemove = query[1]

				return Promise.all([
					group,
					userToRemove,
					Abilities.can(user, 'removeMember', group)
				])
			}).then(query => {
				let group = query[0]
				let userToRemove = query[1]

				if (!group)
					throw new Error.NotFound('Group not found')
				
				if (!hasObjectId(group[property], userToRemove._id))
					throw new Error.NotFound('User not found')
				
				let toRemove = { $pull: { subscribers: userToRemove._id } }

				return Promise.all([
					userToRemove,
					Channel.findOneAndUpdate({ group: groupId }, toRemove).exec()
				])
			}).then(results => {
				let userToRemove = results[0]
				let toRemove = { $pull: { [property]: userToRemove._id } }

				return Group.findByIdAndUpdate(groupId, toRemove).exec()
			}).then(removed => res.sendStatus(204))
			.catch(err => ErrorHandler.toRequest(err, res))
	}

	/**
	 * Will add temporary members based on csv file
	 * @param {Express.Request} 	req Stores the Request from front-end
	 * @param {Express.Response} 	res Stores the response from back-end
	 */
	addMembers(req, res) {
		let user = req.user
		let groupId = req.params.groupId
		let file = req.file
		let type = (req.file) ? req.file.mimetype : undefined
		let csvHandler = new CSVHandler(file)
		let thisGroup

		Group.findById(groupId).populate('members tempUsers').exec()
			.then(group => Abilities.can(user, 'addMember', group))
			.then(group => {
				let promises = []
				thisGroup = group._doc

				if (type !== 'text/csv') { 
					throw new Error.BadRequest('INVALID_FILE_TYPE') }

				let tempUsersEmails = thisGroup.tempUsers.map(tempUser => tempUser.email)

				let emails = csvHandler.toArray(tempUsersEmails)

				if (!emails) { 
					throw new Errors.BadRequest('EMPTY_FILE') }

				if (!Array.isArray(emails) || emails.length > 0) {
					let query = { $push: { tempUsers: { $each: emails } } }

					promises = emails.map(email => User.getOrCreateFromEmail(email))
				} else {
					let teste = csvHandler.getStatus()

					console.log(teste);
					throw new Error.BadRequest(teste)
				}

				return Promise.all(promises)
			}).then(users => {
				let promises = []
				promises = users.map(entry => {
					let insertQuery
					if (entry.uid) {
						if (!hasObjectId(thisGroup.members, user._id)) {
							insertQuery = { $push: { members: entry._id } }
							return Group.findByIdAndUpdate(groupId, insertQuery).exec()
						}
					} else {
						insertQuery = { $push: { tempUsers: entry._id } }
						return Group.findByIdAndUpdate(groupId, insertQuery).exec()
					}

				})

				res.status(201).json(csvHandler.getStatus())
			}).catch(err => ErrorHandler.toRequest(err, res))
	}

	/* private */

	_validateSearchQuery(query) {
		return new Promise((resolve, reject) => {
			if (!query) throw new Error.BadRequest('No query provided')
			else resolve()
		})
	}
}

/** @module Group */
module.exports = GroupController
