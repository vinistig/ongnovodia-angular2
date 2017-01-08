const assert = require('chai').assert

describe('Group', () => {
	before('setup', done => done())

	describe('#list', () => {
		it('should list all groups if user is an admin')
		it('should list groups user is either an owner or channel manager')
	})

	describe('#get', () => {
		it('should show the group details if user is an admin')
		it('should show the group details if user is an owner or channel manager')
		it('should deny if user is not an admin, owner or channel manager')
	})

	describe('#new', () => {
		it('should create a group if user is an admin')
		it('should deny if user is not an admin')
	})

	describe('#edit', () => {
		it('should edit if user is an admin')
		it('should edit if user is an owner')
		it('should deny if user is not admin or owner')
	})

	describe('#delete', () => {
		it('should delete if user is an admin')
		it('should deny if user is not an admin')
	})

	describe('#addOneMember', () => {
		it('should add member if user is an admin')
		it('should add member if user is an owner')
		it('should deny if user is not an admin or owner')
		it('should get user from bluepages if doesn\'t exist on the database yet')
	})

	describe('#addMembers', () => {
		it('should add members if user is an admin')
		it('should add members if user is an owner')
		it('should deny if user i not an admin or owner')
	})
	
})