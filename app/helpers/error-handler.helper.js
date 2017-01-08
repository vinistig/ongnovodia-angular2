let shouldLog = (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') ? true : false

class ErrorHandler {	
	static toRequest(err, res) {
		if(shouldLog) console.log(err)

		if(err.name == 'MongoError' && err.code == 11000) {
			return res.status(400).json({ 
				message: "DUPLICATE_NOT_ALLOWED",
				mongoError: err
			})
		}

		// TODO: Handle mongo validation errors
		switch(err.name){
			case 'UidNotFound':
				return res.status(404).json(err)
			case 'AccessDenied':
				return res.status(403).json(err)
			case 'Unauthorized':
				return res.status(401).json(err)
			case 'Forbidden':
				return res.status(403).json(err)
			case 'NotFound':
				return res.sendStatus(404)
			case 'AlreadyExists':
				return res.status(400).json(err)
			case 'MongoError':
				return res.status(500).json(err)
			case 'TypeError':
				return res.status(500).json(err.message)
			case 'BadRequest':
				return res.status(400).json(err)
			default:
				return res.status(500).json(err)
		}
	}

}

module.exports = ErrorHandler
