const assert = require('chai').assert

describe('Video', () => {
	before('setup', done => done())

	describe('#allForGroup', () => {
		it('should list all videos for a group')
		it('should deny if user is not a member of the group')
	})

	describe('#get', () => {
		it('should show the video details')
		it('should deny if user is not a member of the group')
	})

	describe('#new', () => {
		it('should create a new video if member of the group')
		it('should deny if posting to a private channel user is not an executive at')
		it('should deny if video has no group')
		it('should deny if video has no channel')
		it('should deny if user is trying to add comments')
		it('should deny if user is trying to add views')
		it('should deny if user is trying to add likes')
	})

	describe('#edit', () => {
		it('should edit video if user is video owner')
		it('should edit video if user is admin')
		it('should edit video if user is group owner')
		it('should edit video if user is channel manager')
		it('should deny if user is not owner, group owner, manager, or admin')
		it('should deny if changes video group')
		it('should deny if video has no channel')
		it('should deny if user is trying to change comments')
		it('should deny if user is trying to change views')
		it('should deny if user is trying to change likes')
	})

	describe('#delete', () => {
		it('should delete video if user is video owner')
		it('should delete video if user is admin')
		it('should delete video if user is group owner')
		it('should delete video if user is channel manager')
		it('should deny if user is not owner, group owner, manager, or admin')
	})

	describe('#like', () => {
		it('should like video if user is member of group')
		it('should warn if video is already liked')
		it('should deny if user does not belong to group')
	})

	describe('#unlike', () => {
		it('should unlike video if user is member of group')
		it('should war if video wasn\'t liked by the user')
		it('should deny if user does not belong to group')
	})

	describe('#allLikesForVideo', () => {
		it('should list all likes for video')
		it('should deny if user doesn\'t belong to group')
	})

	describe('#view', () => {
		it('should add a view for user to video')
		it('should add a view if user has already viewed video')
		it('should deny if user does\'t belong to group')
	})

	describe('#allViewsForVideo', () => {
		it('should list all views for video')
		it('should deny if user doesn\'t belong to group')
	})

	describe('#list', () => {
		it('should list all videos for a channel')
		it('should deny if user doesn\'t belong to group')
	})

})