function bootDatabase(config) {
	const mongoose = require('mongoose')
	mongoose.Promise = global.Promise
	mongoose.connect(config.uri + config.name)
}

module.exports = bootDatabase;
