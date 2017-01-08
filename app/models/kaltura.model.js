const yamler = require('yamler')
const env    = process.env.NODE_ENV || 'development'
const Errors = apprequire('helpers/errors.helper')
const Config = yamler(`${__dirname}/../../config/application.yml`)[env]
const https  = require('https')

class KalturaModel {
	constructor() {
		this.adminId    = 'LVJY60631'
		this.partnerId  = '1773841'
		this.secret     = 'a50340f85231a6baf91567688f0a3459'
		this.categoryId = Config.kalturaCategoryId
		this.session    = false
	}

	addUser(user) {
	return new Promise((resolve, reject) => {
		if(user.hasKalturaSession) return resolve()
		let id = user.id

		this._createAdminSession()
		.then(() => this._addUserToKalturaByDocId(id))
		.then(() => this._addUserToCategoryByDocId(id))
		.then(() => resolve())
		.catch(err => reject(err))
	})
	}


	/* private */


	_createAdminSession() {
	return new Promise((resolve, reject) => {
		if(this.session) return resolve(this.session)

		const params = `&type=2&secret=${this.secret}&partnerId=${this.partnerId}&userId=${this.adminId}`

		this._call('session', 'start', params)
		.then(session => {
			this.session = session
			resolve()
		})
		.catch(err => reject(err))
	})
	}

	_addUserToKalturaByDocId(id) {
	return new Promise((resolve, reject) => {
		if(!this.session) 
			throw new Errors.KalturaError('Session not present')

		const params = `&user[id]=${id}&ks=${this.session}`
		this._call('user', 'add', params)
		.then(userAdded => {
			if(!userAdded.code || userAdded.code=="DUPLICATE_USER_BY_ID") 
				resolve()
			else 
				reject()
		})
	})
	}

	_addUserToCategoryByDocId(id) {
		if(!this.session) 
			throw new Errors.KalturaError('Session not present')

		const params = `&categoryUser[categoryId]=${this.categoryId}&categoryUser[userId]=${id}&categoryUser[permissionLevel]=3&ks=${this.session}`
		return this._call('categoryUser', 'add', params)
	}

	_call(service, action, parameters = '') {
	return new Promise((resolve, reject) => {	
		let kalturaUrl = `https://www.kaltura.com/api_v3/service/${service}/action/${action}`
		let params     = `?format=1${parameters}`

		https.get(`${kalturaUrl}${params}`, res => {
			res.on('data', data => {
				let json = JSON.parse(data)
				resolve(json)
			})
		})
		.on('error', err => reject(err))
	})
	}
}

module.exports = KalturaModel
