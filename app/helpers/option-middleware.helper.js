module.exports = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		return res.end();
	} else {
		return next();
	}
}