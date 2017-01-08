
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {
	bdd.describe('Admin', function () {

		//consts from stub
		const baseUrl                   = testStub.baseUrl;
		const adminUrl                  = testStub.adminStub.adminUrl;
		const validBluepagesId          = testStub.adminStub.validBluepagesId_1.email;
		const invalidBluepagesId        = testStub.adminStub.invalidBluepagesId.email;

		bdd.before(function () {
			console.log('Beggining admin suite tests.');
		});

		bdd.after(function () {
			console.log('Finished admin suite tests.');
		});

		bdd.beforeEach(function () {
			// executes before each test
		});

		bdd.afterEach(function () {
			// executes after each test
		});

		bdd.describe('Admin list must not be empty', function () {

			bdd.it('List should never be empty.', function () {
				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					assert.isAtLeast(users.length, 1, 'Admin list must have at least one member');
				});
			});

			bdd.it('Remove button should not be available if we have only one admin', function () {

				var usersNumber;

				this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					usersNumber = users.length;
				});

				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findById('rmv-button')
				.then(
					function(successful) {
						if(usersNumber == 1) {
							assert.isOk(false, 'Remove button should not exist if we have only one admin');
						} else if(usersNumber == 0) {
							assert.isOk(false, 'No admins were found in list');
						} else {
							assert.isOk(true, 'Remove button can exist if we have more than one admin');
						}
					},
					function(err) {
						if(usersNumber == 1) {
							assert.isOk(true, 'Remove button does not exist when we have only one admin');
						};
					});
			});

		});

		bdd.describe('Adding an Admin', function () {

			bdd.it('Add Admin Modal should be displayed when clicking at New Admin button.', function () {
				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findById('add-admin-button')
				.click()
				.end()
				.findById('bp-search')
				.then(
					function(successful) {
						assert.isOk(true, 'There is a space to look for a Bluepages ID user.');
					},
					function(err) {
						assert.isOk(false, 'Should exist a space to look for a Bluepages ID user.');
					});
			});

			bdd.it('Should exist a message informing that a non existent Bluepages ID is inserted.', function () {
				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(500)
				.findById('add-admin-button')
				.click()
				.end()
				.sleep(5000)
				.findById('search-box')
				.click()
				.pressKeys(invalidBluepagesId)
				.end()
				.sleep(5000)
				.findById('empty-answer')
				.then(
					function(successful) {
						assert.isOk(true, 'There is a message informing there is no Bluepages ID for the input term.');
					},
					function(err) {
						assert.isOk(false, 'Should exist a message informing user that there are no Bluepages ID results for the input term.');
					});
			});

			bdd.it('Should add a Bluepages ID as Admin.', function () {

				var usersNumber;

				this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					usersNumber = users.length;
				});

				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(3000)
				.findById('add-admin-button')
				.click()
				.end()
				.sleep(3000)
				.findById('search-box')
				.click()
				.pressKeys(validBluepagesId)
				.end()
				.sleep(5000)
				.findAllByClassName('user-list__user__avatar')
				.then(function(el) {
					el[usersNumber].click()
				})
				.end()
				.sleep(5000)
				.findById('repeated-user-warning')
				.then(
					function(successful) {
						assert.isOk(false, 'Bluepages user already is an admin.');
					},
					function(err) {
						assert.isOk(true, 'Bluepages user was successfully added as admin.');
					});
			});

			bdd.it('Should display a message informing if an Admin already is inserted.', function () {

				var usersNumber;

				this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					usersNumber = users.length;
				});

				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(3000)
				.findById('add-admin-button')
				.click()
				.end()
				.sleep(3000)
				.findById('search-box')
				.click()
				.pressKeys(validBluepagesId)
				.end()
				.sleep(5000)
				.findAllByClassName('user-list__user__avatar')
				.then(function(el) {
					el[usersNumber].click()
				})
				.end()
				.sleep(5000)
				.findById('repeated-user-warning')
				.then(
					function(successful) {
						assert.isOk(true, 'Warning message informing that the admin already is added exists.');
					},
					function(err) {
						assert.isOk(false, 'There should be a warning message informing that bluepages user is already added.');
					});
			});

		});


		bdd.describe('Removing an admin (if there is more than one Admin added)', function () {

			bdd.it('Confirmation message should be displayed when trying to remove an Admin.', function () {
				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(3000)
				.findById('rmv-button')
				.click()
				.end()
				.sleep(8000)
				.findByClassName('modal-body')
				.findById('rmv-confirmation-message')
				.getVisibleText()
				.then(
					function(successful) {
						assert.isOk(true, 'Confirmation message is presented when trying to remove an Admin.');
					},
					function(err) {
						assert.isOk(false, 'Should exist a confirmation message when trying to remove an Admin.');
					});
			});

			bdd.it('Should exist one Admin less in the total after removing one.', function () {

				var numberOfAdminsBeforeRemoval = 0;

				this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(
					function(elem) {
						numberOfAdminsBeforeRemoval = elem.length;
					}
					);

				return this.remote
				.get(require.toUrl(baseUrl + adminUrl))
				.sleep(5000)
				.findById('rmv-button')
				.click()
				.end()
				.sleep(2000)
				.findByClassName('btn-primary')
				.click()
				.end()
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(
					function(elem) {
						assert.equal(elem.length, numberOfAdminsBeforeRemoval-1, 'There should be one Admin less in list total.');
					}
					);

			});

		});

	});
});
