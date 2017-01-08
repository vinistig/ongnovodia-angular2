const Config = apprequire('models/config.model')
const Promise_serial = require('promise-serial')
const Group = apprequire('models/group.model')
const User = apprequire('models/user.model')

let versions = [ v0 ]
let currentVersion = versions.length - 1

/**
 * Checks the version of the database and update accordingly
 * @param  {string} env The environment the version is being executed   
 */
module.exports = function(env) {
	Config.getLatest(env)
	.then(current => {
		if (!current) {	
			return versions[0](env)
			.then(() => {
				if (currentVersion!==0) bumpVersion(env, currentVersion)})
			.catch(err => {throw err})
		}
		
		let promises = []
		let thisVersion = current.dbVersion

		for (thisVersion; thisVersion < currentVersion; thisVersion++) {
			promises.push(versions[thisVersion+1](env))
		}
		
		return Promise_serial(promises)
	})
	.catch(err => console.log(err))
}

/**
 * Populate the database according it's version
 * @param  {Number} version The version to populate the database
 * @return {Promise}
 * @private
 */
function bumpVersion(env, version) {
	let config         = new Config()
	config.dbVersion   = version
	config.date        = new Date()
	config.environment = env
	
	return config.save()
}

/**
 * Insert the breakingbug user to the database
 * @return {Promise}    
 * @private 
 */
function v0(env){
return new Promise((resolve, reject) => {
	let thisUser;

	User.getOrUpdateFromUid("LVJY60631")
	.then(user => {
		thisUser = user

		return User.findByIdAndUpdate(user._id, {isAdmin: true}).exec()
	}).then(() => {

		return Group.find({name: 'Group For tests'}).exec()
	}).then(found => {

		if (found.length === 0) {
			let group = new Group()
			group.name = 'Group For tests'
			group.description = 'This will be use to allow the breaking bug log in as admin'
			group.owners = [thisUser]
			group.members = [thisUser]

			return group.save()
		} else {
			return true
		}
		
	}).then(() => bumpVersion(env, 0))
	.then(() => resolve())
	.catch(err => reject(err))
})
}
