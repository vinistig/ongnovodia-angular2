function bootDatabase(config) {
	const mongoose = require('mongoose')
	mongoose.Promise = global.Promise
	mongoose.connect(config.uri)
}

module.exports = bootDatabase;
