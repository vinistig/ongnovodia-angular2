const moment = require('moment')
const hasObjectId = apprequire('helpers/has-object-id.helper')

/**
 * Several routines shared across the application
 */
class Utils {
	/**
	 * Will check if the logged user subscribed the channel
	 * @param  {User}  				user    	An object of model User
	 * @param  {Array<Object>}  	array 		An object of mongoose model
	 * @return {Boolean}         				Returns true when the logged user subscribed the channel
	 */
	static isMember(user, array){
		if(hasObjectId(array, user._id)) { 
			return true
		} else {
			return false
		}
	}

		/**
	 * Will return true if the logged has can edit the video
	 * @param  {User}  		user  	An object of the model User
	 * @param  {Video} 		Video 	An object of the model VideoLike
	 * @return {Boolean}       		True, if the logged user can edit the video
	 */
	static canEditVideo(user, video) {
		if(user.isAdmin) { return true }
		if(video.owner === user._id) { return true }

		let groupOwners = video.group.owners || video.group
		if(hasObjectId(groupOwners, user._id)) { return true }

		let channelsOwnersObjectsIds = video.channels.map(c => c.managers)
		channelsOwnersObjectsIds = [].concat.apply([], channelsOwnersObjectsIds)
		
		if(hasObjectId(channelsOwnersObjectsIds, user._id)) { return true }

		return false
	}

	/**
	 * Will return true if the logged has liked the video
	 * @param  {User}  		user  	An object of the model User
	 * @param  {VideoLike} 	likes 	An object of the model VideoLike
	 * @return {Boolean}       		True, if the logged user has liked the video
	 */
	static isLiked(user, likes) {
		let likesOwnersObjectsIds = likes.map(like => like.owner)
		likesOwnersObjectsIds = [].concat.apply([], likesOwnersObjectsIds)

		if(hasObjectId(likesOwnersObjectsIds, user._id)) { return true }

		return false
	}

	/**
	 * Will return true if the logged is an executive all remove the properties managers
	 * @param  {User}  		user  	An object of the model User
	 * @param  {VideoLike} 	likes 	An object of the model VideoLike
	 * @return {Boolean}       		True, if the logged user has liked the video
	 */
	static isExecutive(user, video) {
		let executivesObjectsIds = video.channels.map(c => c.executives)
		executivesObjectsIds = [].concat.apply([], executivesObjectsIds)

		if(hasObjectId(executivesObjectsIds, user._id)) { return true }

		return false
	}

	/**
	 * Will return the relative time based in a date passed from the user
	 * @param  {Date} 	date 		The date to get the relative time
	 * @return {String}      		The relative date
	 */
	static getRelativeTime(date) {
		return moment(date).fromNow()
	}
}

module.exports = Utils
