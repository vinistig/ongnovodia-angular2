const assert = require('chai').assert

describe('Channel', () => {
	before('setup', done => done())

	describe('#index', () => {
		it('should list all channels for group if user is an admin')
		it('should list all channels for group if user is a group owner')
		it('should list all channels for group user is a manager for')
		it('should deny if user is not an admin, owner, manager')
	})

	describe('#new', () => {
		it('should create if user is an admin')
		it('should create if user is a group owner for the group')
		it('should deny if user is not an admin or doesn\'t own the group')
		it('should replace array of uids with array of users')
	})

	describe('#get', () => {
		it('should get a channel details if user is an admin')
		it('should get a channel details if user is group owner')
		it('should get a channel details if user is channel manager for the channel')
		it('should deny if user is not admin, owner, or manager')
	})

	describe('#edit', () => {
		it('should edit a channel if user is an admin')
		it('should edit a channel if user is group owner')
		it('should deny if user is not admin or owner')
		it('should deny if user tries to change channel privacy')
	})

	describe('#delete', () => {
		it('should delete channel if user is an admin')
		it('should delete channel if user is a group owner')
		it('should deny if user is not an admin or owner')
		it('should remove channel from videos that have it')
	})

	describe('#subscribe', () => {
		it('should subscribe user to channel')
		it('should warn if user is already subscribed')
	})

	describe('#unsubscribe', () => {
		it('should unsubscribe user from channel')
		it('should warn if user is already unsubscribed')
	})
	
})