
module.exports = {
	ibmEmail: {
		validator: function(v) {
			return /@[a-z]*[.]?ibm.com/.test(v);
		},
		message: '{VALUE} is not a ibm email!'
	}
}