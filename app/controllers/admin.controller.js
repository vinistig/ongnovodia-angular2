const User         = apprequire('models/user.model')
const Abilities    = apprequire('helpers/abilities.helper')
const Error        = apprequire('helpers/errors.helper')
const ErrorHandler = apprequire('helpers/error-handler.helper')
const Faces        = require('ibm-bluemix-faces')

class AdminController {
	constructor() {}

	index(req, res) {
		let user = req.user

		Abilities.can(user, 'list', 'Admin')
		.then(can => User.find({ 'isAdmin': true }).exec())
		.then(users => res.status(200).json(users))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	add(req, res) {
		let user = req.user
		let uid  = req.params.uid

		// TODO: front is sending whole object
		Abilities.can(user, 'add', 'Admin')
		.then(() => User.getOrUpdateFromUid(uid))
		.then(user => {
			if(user.isAdmin) throw new Error.AlreadyExists()
			
			user.isAdmin = true
			return user.save()
		})
		.then(saved => res.status(201).json([]))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	delete(req, res) {
		let user = req.user
		let uid  = req.params.uid

		Abilities.can(user, 'delete', 'Admin')
		.then(() => User.update({ 'uid': uid }, {$set: { isAdmin: false }}).exec())
		.then(update => {
			if(update.n === 0 || update.nModified === 0) throw new Error.NotFound()
			
			return res.sendStatus(204)
		})
		.catch(err => ErrorHandler.toRequest(err, res))
	}

}

module.exports = AdminController;
