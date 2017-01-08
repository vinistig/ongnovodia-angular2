
module.exports = {
	UidNotFound:      UidNotFound,
	PermissionDenied: PermissionDenied,
	Unauthorized:     Unauthorized,
	NotFound:         NotFound,
	AlreadyExists:    AlreadyExists,
	BadRequest:       BadRequest,
	Forbidden:        Forbidden,
	KalturaError:     KalturaError
}

/**
 * Uid not found on bluepages
 * @param {string} message A custom message to overwrite the default one
 */
function UidNotFound(message) {
	this.name = 'UidNotFound'	
	this.message = message || 'UID_NOT_FOUND'
	this.stack = (new Error()).stack
}
UidNotFound.prototype = Object.create(Error.prototype)
UidNotFound.prototype.constructor = UidNotFound

/**
 * User is trying to access a resource he does
 * @param {string} message A custom message to overwrite the default one
 * not have permission to
 */
function PermissionDenied(message) {
	this.name = 'PermissionDenied'
	this.message = message || 'PERMISSION_DENIED'
	this.stack = (new Error()).stack
}
PermissionDenied.prototype = Object.create(Error.prototype)
PermissionDenied.prototype.constructor = PermissionDenied

/**
 * User trying to login has no permission to do so
 * @param {string} message A custom message to overwrite the default one
 */
function Unauthorized(message) {
	this.name = 'Unauthorized'
	this.message = message || 'UNAUTHORIZED'
	this.stack = (new Error()).stack
}
Unauthorized.prototype = Object.create(Error.prototype)
Unauthorized.prototype.constructor = Unauthorized

/**
 * Not found on bluepages
 * @param {string} message A custom message to overwrite the default one
 */
function NotFound(message) {
	this.name = 'NotFound'	
	this.message = message || 'NOT_FOUND'
	this.stack = (new Error()).stack
}
NotFound.prototype = Object.create(Error.prototype)
NotFound.prototype.constructor = NotFound

/**
 * Attempt to create something that already exists
 * @param {string} message A custom message to overwrite the default one
 */
function AlreadyExists(message) {
	this.name = 'AlreadyExists'	
	this.message = message || 'ALREADY_EXISTS'
	this.stack = (new Error()).stack
}
AlreadyExists.prototype = Object.create(Error.prototype)
AlreadyExists.prototype.constructor = AlreadyExists

/**
 * User trying to execute an API with invalid parameters
 * @param {string} message A custom message to overwrite the default one
 */
function BadRequest(message) {
	this.name = 'BadRequest'
	this.message = message || 'BAD_REQUEST'
	this.stack = (new Error()).stack
}
BadRequest.prototype = Object.create(Error.prototype)
BadRequest.prototype.constructor = BadRequest

/**
 * User trying to perform an action he has no permission to
 * @param {string} message A custom message to overwrite the default one
 */
function Forbidden(message) {
	this.name = 'Forbidden'
	this.message = message || 'BAD_REQUEST'
	this.stack = (new Error()).stack
}
Forbidden.prototype = Object.create(Error.prototype)
Forbidden.prototype.constructor = Forbidden

/**
 * Error when trying to communicate with Kaltura
 * @param {string} message A custom message to overwrite the default one
 */
function KalturaError(message) {
	this.name = 'KalturaError'
	this.message = message || 'KALTURA_ERROR'
	this.stack = (new Error()).stack
}
KalturaError.prototype = Object.create(Error.prototype)
KalturaError.prototype.constructor = KalturaError
