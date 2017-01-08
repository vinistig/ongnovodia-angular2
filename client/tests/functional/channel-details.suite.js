
define(['intern', 'intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (intern, bdd, assert, expect, require, testStub) {
	bdd.describe('ChannelDetails', function () {

		//consts from stub
		// const baseUrl = testStub.baseUrl;
		// const adminUrl = testStub.adminStub.adminUrl;
		const AdminId = testStub.validAdmin.email;
		const AdminIdPassword = intern.args.bbPassword;
		const invalidBluepagesId = testStub.channelDetailsStub.invalidBluepagesId;
		const group = testStub.channelDetailsStub.group;
		const nonAdminId = intern.args.nonAdminEmail;
		const nonAdminIdPassword = intern.args.nonAdminPassword;
		const commonChannel = testStub.channelDetailsStub.channel;
		const privateChannel = testStub.channelDetailsStub.privateChannel;
		const primaryChannel = testStub.channelDetailsStub.primaryChannel;

		bdd.before(function () {
			return this.remote
				.get(require.toUrl(testStub.baseUrl + 'login'))
				.sleep(5000)
				.findById('intranetId')
				.click()
				.clearValue()
				.pressKeys(AdminId)
				.end()
				.findById('password')
				.click()
				.clearValue()
				.pressKeys(AdminIdPassword)
				.end()
				.findById('loginButton')
				.click()
				.end()
				.sleep(5000)
				.findById('new-group')
				.click()
				.end()
				.sleep(5000)
				.findById('groupName')
				.click()
				.clearValue()
				.pressKeys(group.name)
				.end()
				.sleep(5000)
				.findById('description')
				.click()
				.clearValue()
				.pressKeys(group.description)
				.end()
				.findById('newGroupBtn')
				.click()
				.end()
				.sleep(7000)
				.findByClassName('group')
				.click()
				.end()
				.sleep(5000)
				.findById('new-channel')
				.click()
				.end()
				.sleep(5000)
				.findById('name')
				.click()
				.clearValue()
				.pressKeys(commonChannel.name)
				.end()
				.findById('description')
				.click()
				.clearValue()
				.pressKeys(commonChannel.name)
				.end()
				.findById('newChannelBtn')
				.click()
				.end()
				.sleep(5000)
				.findById('new-channel')
				.click()
				.end()
				.sleep(5000)
				.findById('name')
				.click()
				.clearValue()
				.pressKeys(privateChannel.name)
				.end()
				.findById('description')
				.click()
				.clearValue()
				.pressKeys(privateChannel.name)
				.end()
				.findById('isPrivate')
				.click()
				.end()
				.findById('newChannelBtn')
				.click()
				.end()
				.sleep(5000)
				.findById('new-channel')
				.click()
				.end()
				.sleep(5000)
				.findById('name')
				.click()
				.clearValue()
				.pressKeys(primaryChannel.name)
				.end()
				.findById('description')
				.click()
				.clearValue()
				.pressKeys(primaryChannel.name)
				.end()
				.findById('isPrivate')
				.click()
				.end()
				.findById('isPrimary')
				.click()
				.end()
				.findById('newChannelBtn')
				.click()
				.end()

		});

		bdd.after(function () {
			return this.remote
				.get(require.toUrl(testStub.baseUrl + 'login'))
				.sleep(5000)
				.findById('intranetId')
				.click()
				.clearValue()
				.pressKeys(AdminId)
				.end()
				.findById('password')
				.click()
				.clearValue()
				.pressKeys(AdminIdPassword)
				.end()
				.findById('loginButton')
				.click()
				.end()
				.sleep(7000)
				.findByClassName('group')
				.click()
				.end()
				.sleep(5000)
				.findById('edit-group')
				.click()
				.end()
				.sleep(3000)
				.findById('archive-group')
				.click()
				.end()
				.sleep(3000)
				.findByClassName('btn-primary')
				.click()
				.end()
		});

		bdd.beforeEach(function () {
			// executes before each test
		});

		bdd.afterEach(function () {
			// executes after each test
		});

		bdd.describe('Channel details availability', function () {

			bdd.it('Should exist a channel information section with all the details.', function () {
				return this.remote
					.sleep(5000)
					.findByClassName('channel')
					.click()
					.end()
					.sleep(5000)
					.findById('channel-information')
					.then(
					function (successful) {
						assert.isOk(true, 'Channel information exists in view');
					},
					function (err) {
						assert.isOk(false, 'Channel information section does not exist');
					});
			});

			bdd.it('Should display publishers list if the channel is private.', function () {
				return this.remote
					.sleep(5000)
					.findByClassName('link__btn')
					.click()
					.end()
					.sleep(5000)
					.findAllByClassName('channel')
					.then(
					function (el) {
						el[1].click()
					}
					)
					.end()
					.sleep(5000)
					.findById('publishers-list')
					.then(
					function (successful) {
						assert.isOk(true, 'Display a publisher list when is a private channel');
					},
					function (err) {
						assert.isOk(false, 'Does not display a publisher list when is a private channel');
					});
			});

			bdd.it('Should not display publishers list if the channel is not private.', function () {
				return this.remote
					.sleep(5000)
					.findByClassName('link__btn')
					.click()
					.end()
					.sleep(5000)
					.findAllByClassName('channel')
					.then(
					function (el) {
						el[0].click()
					}
					)
					.end()
					.sleep(5000)
					.findById('publishers-list')
					.then(
					function (successful) {
						assert.isOk(false, 'Display a publisher list when it is not a private channel');
					},
					function (err) {
						assert.isOk(true, 'Does not display a publisher list when it is not a private channel');
					});
			});

		});

		bdd.describe('Channel manager features', function () {

			bdd.it('Should exist an input field to add a manager to channel.', function () {
				return this.remote
					.sleep(5000)
					.findById('search-manager')
					.click()
					.end()
					.sleep(5000)
					.findById('search-box')
					.then(
					function (successful) {
						assert.isOk(true, 'Input field to look for a bluepages user exists');
					},
					function (err) {
						assert.isOk(false, 'Input field to look for a bluepages user does not exists');
					});
			});

			bdd.it('Should exist a message informing that a non existent Bluepages ID is inserted.', function () {
				return this.remote
					.findById('search-box')
					.click()
					.pressKeys(invalidBluepagesId)
					.end()
					.sleep(5000)
					.findById('empty-answer')
					.then(
					function (successful) {
						assert.isOk(true, 'There is a message informing there is no Bluepages ID for the input term.');
					},
					function (err) {
						assert.isOk(false, 'Should exist a message informing user that there are no Bluepages ID results for the input term.');
					});
			});

			bdd.it('Should be able to add a channel manager.', function () {
				return this.remote
					.findById('search-box')
					.click()
					.clearValue()
					.pressKeys(nonAdminId)
					.end()
					.sleep(5000)
					.findAllByClassName('user-list__user__avatar')
					.then(
					function (el) {
						el[0].click()
					}
					)
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(true, 'Successfully added a channel manager.');
					},
					function (err) {
						assert.isOk(false, 'Failed to add a channel manager.');
					});
			});

			bdd.it('Should be able to cancel a channel manager removal.', function () {
				return this.remote
					.findById('rmv-manager-btn')
					.click()
					.end()
					.sleep(5000)
					.findById('cancel-rmv')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(true, 'Successfully canceled a channel manager removal.');
					},
					function (err) {
						assert.isOk(false, 'Failed to cancel a channel manager removal.');
					});
			});

			bdd.it('Should be able to remove a channel manager.', function () {
				return this.remote
					.findById('rmv-manager-btn')
					.click()
					.end()
					.sleep(5000)
					.findById('confirm-rmv')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(false, 'Failed to remove a channel manager.');
					},
					function (err) {
						assert.isOk(true, 'Successfully removed a channel manager.');
					});
			});

		});

		bdd.describe('Channel publisher features', function () {

			bdd.it('Should not exist an input field to add a publisher to non private channel.', function () {
				return this.remote
					.sleep(5000)
					.findById('search-publisher')
					.then(
					function (successful) {
						assert.isOk(false, 'Input field to look for a bluepages user exists');
					},
					function (err) {
						assert.isOk(true, 'Input field to look for a bluepages user does not exists');
					});
			});

			bdd.it('Should exist an input field to add a publisher to a private channel.', function () {
				return this.remote
					.sleep(5000)
					.findByClassName('link__btn')
					.click()
					.end()
					.sleep(5000)
					.findAllByClassName('channel')
					.then(
					function (el) {
						el[1].click()
					}
					)
					.end()
					.sleep(5000)
					.findById('search-publisher')
					.click()
					.end()
					.sleep(5000)
					.findById('search-box')
					.then(
					function (successful) {
						assert.isOk(true, 'Input field to look for a bluepages user exists');
					},
					function (err) {
						assert.isOk(false, 'Input field to look for a bluepages user does not exists');
					});
			});

			bdd.it('Should exist a message informing that a non existent Bluepages ID is inserted.', function () {
				return this.remote
					.findById('search-box')
					.click()
					.pressKeys(invalidBluepagesId)
					.end()
					.sleep(5000)
					.findById('empty-answer')
					.then(
					function (successful) {
						assert.isOk(true, 'There is a message informing there is no Bluepages ID for the input term.');
					},
					function (err) {
						assert.isOk(false, 'Should exist a message informing user that there are no Bluepages ID results for the input term.');
					});
			});

			bdd.it('Should be able to add a channel publisher.', function () {
				return this.remote
					.findById('search-box')
					.click()
					.clearValue()
					.pressKeys(nonAdminId)
					.end()
					.sleep(3000)
					.findAllByClassName('user-list__user__avatar')
					.then(
					function (el) {
						el[0].click()
					}
					)
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(true, 'Successfully added a channel publisher.');
					},
					function (err) {
						assert.isOk(false, 'Failed to add a channel publisher.');
					});
			});

			bdd.it('Should be able to cancel a channel publisher removal.', function () {
				return this.remote
					.findById('rmv-publisher-btn')
					.click()
					.end()
					.sleep(5000)
					.findById('cancel-rmv')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(true, 'Successfully canceled a channel publisher removal.');
					},
					function (err) {
						assert.isOk(false, 'Failed to cancel a channel publisher removal.');
					});
			});

			bdd.it('Should be able to remove a channel publisher.', function () {
				return this.remote
					.findById('rmv-publisher-btn')
					.click()
					.end()
					.sleep(5000)
					.findById('confirm-rmv')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('user-list__user__avatar')
					.then(
					function (successful) {
						assert.isOk(false, 'Successfully removed a channel publisher.');
					},
					function (err) {
						assert.isOk(true, 'Failed to remove a channel publisher.');
					});
			});

		});

		bdd.describe('Edit channel button visibility', function () {

			bdd.it('Should be able to edit a channel when user is admin.', function () {
				return this.remote
					.sleep(5000)
					.findByClassName('link__btn')
					.click()
					.end()
					.sleep(5000)
					.findAllByClassName('channel')
					.then(
					function (el) {
						el[0].click()
					}
					)
					.end()
					.sleep(5000)
					.findById('edit-channel-btn')
					.then(
					function (successful) {
						assert.isOk(true, 'Edit channel button is visible for admins users.');
					},
					function (err) {
						assert.isOk(false, 'Edit channel button is not visible for admins users.');
					});

			});

			bdd.it('Should not be able to edit a channel when user is channel manager.', function () {
				this.timeout = 60000;
				return this.remote
					.sleep(5000)
					.findById('search-manager')
					.click()
					.end()
					.sleep(5000)
					.findById('search-box')
					.click()
					.pressKeys(nonAdminId)
					.end()
					.sleep(5000)
					.findAllByClassName('user-list__user__avatar')
					.then(
					function (el) {
						el[0].click()
					}
					)
					.end()
					.sleep(5000)
					.get(require.toUrl(testStub.baseUrl + 'login'))
					.sleep(5000)
					.findById('intranetId')
					.click()
					.clearValue()
					.pressKeys(nonAdminId)
					.end()
					.findById('password')
					.click()
					.clearValue()
					.pressKeys(nonAdminIdPassword)
					.end()
					.findById('loginButton')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('group')
					.click()
					.end()
					.sleep(5000)
					.findByClassName('channel')
					.click()
					.end()
					.sleep(5000)
					.findById('edit-channel-btn')
					.then(
					function (successful) {
						assert.isOk(false, 'Edit channel button should not be visible for channel managers.');
					},
					function (err) {
						assert.isOk(true, 'Edit channel button is not visible for channel managers.');
					});
			});

		});

	});
});
