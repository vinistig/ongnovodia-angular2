const Session = apprequire('models/session.model')
const ignoredRoutes = [
	'/api/login',
	'/api/login-admin',
	'/api/status'
]

module.exports = (req, res, next) => {
	if(isIgnoredRoute(req.url)) return next()

	let token = req.get('X-Authtoken')
	if(!token) return res.status(401).json({ message: "TOKEN_NOT_PRESENT" })

	Session.findOne({ token: token }).populate('user').exec()
	.then(session => {
		if(!session) return res.status(401).json({ message: "SESSION_NOT_FOUND"})

		req.user = session.user
		req.session = session
		next()
	})
}

function isIgnoredRoute(url) {
	let is = false

	for (ignoredRoute of ignoredRoutes) {
		if(url.match(ignoredRoute)) {
			is = true
			break;
		}
	}

	return is
}
