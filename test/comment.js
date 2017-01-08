const assert = require('chai').assert

describe('Comment', () => {
	before('setup', done => done())

	describe('#allForVideo', () => {
		it('should list all comments for a video')
		it('should deny if user does not belong to group')
	})

	describe('#new', () => {
		it('should comment')
		it('should deny if user does not belong to group')
	})

	describe('delete', () => {
		it('should delete comment if user is comment owner')
		it('should delete comment if user is admin')
		it('should delete comment if user is group owner')
		it('should delete comment if user is channel manager')
		it('should deny if user is not comment owner, admin, group owner, or channel manager')
	})
	
})