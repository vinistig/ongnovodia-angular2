const assert = require('chai').assert

describe('Admin', () => {
	before('setup', done => done())
	
	describe('#index', () => {
		it('should list all videos from channels user is subscribed to, from the groups user is a member of')
		it('should sort videos by views')
		it('should sort videos by likes')
		it('should sort videos by oldest')
		it('should list videos from private channels first')
	})

	describe('#allForGroup', () => {
		it('should list all videos from the groups user is a member of')
		it('should sort videos by views')
		it('should sort videos by likes')
		it('should sort videos by oldest')
		it('should list videos from private channels first')
	})
	
})