const User        = apprequire('models/user.model.js')
const Session     = apprequire('models/session.model.js')
const Group       = apprequire('models/group.model')
const Channel     = apprequire('models/channel.model')
const Errors      = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')

class LoginController {
	constructor() {}

	login(req, res) {
		User.verifyUserAndPassword(req.body)
		.then(user => res.status(200).json(user))
		.catch(err => ErrorHandler.toRequest(err, res))

		// User.getOrUpdateFromUid(login.uid)
		// .then(user => Promise.all([
		// 	this._canLoginToApp(user),
		// 	user
		// ]))
		// .then(query => {
		// 	let hasPermission = query[0]
		// 	let user = query[1]
		//
		// 	return Promise.all([
		// 		user,
		// 		User.getPermissionsFor(user),
		// 		Session.createFromUid(login.uid, 'mobile')
		// 	])
		// })
		// .then(query => {
		// 	let user        = query[0]
		// 	let permissions = query[1]
		// 	let session     = query[2]
		// 	let response    = {
		// 		kalturaId:   user.id,
		// 		email:       user.email,
		// 		uid:         user.uid,
		// 		name:        user.name,
		// 		token:       session.token,
		// 		permissions: permissions
		// 	}
		//
		// 	res.status(200).json(response)
		// })
		// .catch(err => ErrorHandler.toRequest(err, res))
	}

	admin(req, res) {
		let login = User.mapLdapUser(req.user)

		// TODO: Return permissions
		User.getOrUpdateFromUid(login.uid)
		.then(user => this._canAdmin(user))
		.then(user => Promise.all([
			Session.createFromUid(login.uid, 'admin'),
			User.getPermissionsFor(user),
			user
		]))
		.then(query => {
			let session       = query[0]
			let permissions = query[1]
			let user        = query[2]
			let response    = {
				email:       user.email,
				uid:         user.uid,
				name:        user.name,
				token:       session.token,
				permissions: permissions
			}

			res.status(200).json(response)
		})
		.catch(err => ErrorHandler.toRequest(err, res))
	}


	/* private */


	_canAdmin(user) {
	return new Promise((resolve, reject) => {
		if(user.isAdmin) return resolve(user)

		Promise.all([
			Group.find({ owners: user }).exec(),
			Channel.find({ managers: user }).exec()
		]).then(query => {
			let groups = query[0]
			let channels = query[1]

			if(groups.length > 0 || channels.length > 0) resolve(user)
			else reject(new Errors.Unauthorized())
		})
		.catch(err => reject(err))
	});
	}

	_canLoginToApp(user) {
	return new Promise((resolve, reject) => {
		Promise.all([
			Group.find({ members: user }),
			Group.find({ tempUsers: user })
		])
		.then(query => {
			let groupsIsMember = query[0]
			let groupsIsTemp   = query[1]
			let promises       = []

			if(groupsIsMember.length === 0 && groupsIsTemp.length === 0)
				return false

			if(groupsIsTemp.length > 0)
				promises.push(this._promoteTempUsers(groupsIsTemp, groupsIsMember, user))

			return promises
		})
		.then(hasPermission => {
			if(!hasPermission) reject(new Errors.Unauthorized('YOU_DONT_HAVE_ANY_GROUPS'))
			else resolve()
		})
		.catch(err => reject(err))
	});
	}

	_canLogin(user) {
	return new Promise((resolve, reject) => {
		Promise.all([
			Group.find({ members: user }),
			Group.find({ tempUsers: user })
		])
		.then(query => {
			let groupsIsMember = query[0]
			let groupsIsTemp   = query[1]
			let promises       = []

			if(groupsIsMember.length === 0 && groupsIsTemp.length === 0)
				return false

			if(groupsIsTemp.length > 0)
				promises.push(this._promoteTempUsers(groupsIsTemp, groupsIsMember, user))

			return promises
		})
		.then(hasPermission => {
			if(!hasPermission) reject(new Errors.Unauthorized('YOU_DONT_HAVE_ANY_GROUPS'))
			else resolve()
		})
		.catch(err => reject(err))
	});
	}

	_promoteTempUsers(groupsIsTemp, groupsIsMember, user) {
		let promotes = []
		let groupsIsMemberIds = groupsIsMember.map(g => g._id.toString())

		for (let group of groupsIsTemp) {
			let groupId = group._id.toString()

			if(groupsIsMemberIds.indexOf(groupId) > -1)
				promotes.push(Group.removeFromTemp(group, user.email))
			else
				promotes.push(Group.promoteFromTemp(group, user))
		}

		return Promise.all(promotes)
	}
}

module.exports = LoginController;
