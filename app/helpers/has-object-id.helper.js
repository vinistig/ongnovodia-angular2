const ObjectId = require('mongoose').Types.ObjectId

module.exports = function(array, item) {
	item  = item.toString()
	array = array.map(item => {
		if(item != null && ObjectId.isValid(item)) return item.toString()
		else if (item != null && ObjectId.isValid(item._id)) return item._id.toString()
		else return //throw new Error('NOT_OBJECT_ID')
	})

	return (array.indexOf(item) > -1)
}