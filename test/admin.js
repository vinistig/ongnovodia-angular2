const assert = require('chai').assert

describe('Admin', () => {
	//before('setup', done => done())

	describe('#list', () => {
		it('should list all admins if user is an admin')
		it('should deny if I\'m not and admin')
	})

	describe('#add', () => {
		it('should add an admin if user is an admin')
		it('should deny if user is not an admin')
		it('should error when trying to add an already existing admin')
	})

	describe('#delete', () => {
		it('should delete an admin if user is an admin')
		it('should deny if user is not an admin')
		it('should error when trying to remove the last admin')
	})
	
})