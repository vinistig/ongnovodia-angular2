const assert = require('chai').assert

describe('Me', () => {
	before('setup', done => done())

	describe('#index', () => {
		it('should get all groups user is a member of')
	})

	describe('#getVideos', () => {
		it('should get all user videos for a specific group')
		it('should deny if user does not belong to group')
	})

	describe('#getGroupsAndChannels', () => {
		it('should get all groups user is a member of and its channels')
	})

	describe('#permissions', () => {
		it('should get user admin permission')
		it('should get all groups user is either a manager or channel manager')
		it('should get all channels user is a channel manager')
	})
})