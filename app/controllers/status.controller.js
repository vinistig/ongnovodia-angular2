
class Status {
	constructor() {}

	index(req, res) {
		res.status(200).json({quem: "maria"})
	}
}

module.exports = Status
