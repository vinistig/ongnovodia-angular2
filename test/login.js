const assert = require('chai').assert

describe('Login', () => {
	before('setup', done => done())

	describe('#mobile', () => {
		it('should login if user is member of at least one group')
		it('should return a session token')
		it('should return a permissions tree')
		it('should return the user info')
		it('should deny if user is member of no groups')
		it('should deny if wrong username/password')
	})

	describe('#admin', () => {
		it('should login if user is admin, group owner, or channel manager')
		it('should return a session token')
		it('should return a permissions tree')
		it('should return the user info')
		it('should deny if user is no admin, group owner, or channel manager')
		it('should deny if wrong username/password')
	})

})