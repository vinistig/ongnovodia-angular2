/*jshint esversion: 6 */
define(['intern', 'intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (intern, bdd, assert, expect, require, testStub) {
  this.timeout = 90000;

  bdd.describe('Users', function () {
    const baseUrl = testStub.baseUrl;
    const validPassword = intern.args.bbPassword;
    const absolutePath = testStub.bulkUserStup.absolutePath + '/client/tests/stup-files/';

    var groupUrl; //since it uses a dinamically URL, I need to store from first time on.

    bdd.it('Change the profile to the Admin', function () {
      return this.remote
        .get(require.toUrl(baseUrl + 'login'))
        .sleep(3000)
        .findById('intranetId')
          .click()
          .clearValue()
          .pressKeys("breakingbug@br.ibm.com")
          .end()
        .findById('password')
          .click()
          .clearValue()
          .pressKeys(validPassword)
          .end()
        .findById('loginButton')
          .click()
          .end()
        .sleep(6000)
        .getCurrentUrl()
        .then(function(url){
          assert.strictEqual(url, require.toUrl(baseUrl + 'groups'), 'The home view is not displayed.');
        });
    });

    bdd.it('Getting the group page', function() {
      return this.remote
      .get(require.toUrl(baseUrl + '/groups'))
      .sleep(4000)
      .findByClassName('group')
        .click()
        .end()
      .sleep(1000)
      .getCurrentUrl()
      .then(function(url){
          groupUrl = url;
          assert.notEqual(url, '', 'Could not retrieve the group URL');
      });
    });
    //
    // bdd.describe('Scenario 1: Button New User', function () {
    //   bdd.it('The button new user should be hidden', function() {
    //     return this.remote
    //     .get(require.toUrl(groupUrl))
    //     .sleep(4000)
    //     .findById('tab-users')
    //       .then(function(element) {
    //         console.log(element);
    //         assert.notEqual(element, null, 'Error is different than predicted');
    //       }).catch(function(error){
    //         assert.notEqual(error, null, 'Error is different than predicted');
    //       });
    //   });
    // });
    //
    // bdd.it('Change the profile to the Admin', function () {
    //   return this.remote
    //     .get(require.toUrl(baseUrl + 'login'))
    //     .sleep(3000)
    //     .findById('intranetId')
    //       .click()
    //       .clearValue()
    //       .pressKeys("breakingbug@br.ibm.com")
    //       .end()
    //     .findById('password')
    //       .click()
    //       .clearValue()
    //       .pressKeys(validPassword)
    //       .end()
    //     .findById('loginButton')
    //       .click()
    //       .end()
    //     .sleep(6000)
    //     .getCurrentUrl()
    //     .then(function(url){
    //       assert.strictEqual(url, require.toUrl(baseUrl + 'groups'), 'The home view is not displayed.');
    //     });
    // });

    bdd.describe('Scenario 2: Adding a user', function () {
      bdd.it('Should exist a message informing that a non existent Bluepages ID is inserted.', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findById('add-User-Btn')
            .click()
            .end()
            .sleep(3000)
          .findDisplayedById('search-box')
            .click()
            .clearValue()
            .pressKeys("sdpoakw")
            .end()
          .sleep(5000)
          .findById('empty-answer')
            .then(function(successful) {
              assert.isOk(true, 'There is a message informing there is no Bluepages ID for the input term.');
            }, function(err) {
              assert.isOk(false, 'Should exist a message informing user that there are no Bluepages ID results for the input term.');
            });
      });

      bdd.it('Should include an user to the list of users', function () {
        var usersNumber;

        this.remote
				.get(require.toUrl(groupUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					usersNumber = users.length;
				});

        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findById('add-User-Btn')
            .click()
            .end()
            .sleep(3000)
          .findDisplayedById('search-box')
            .click()
            .clearValue()
            .pressKeys("thiagogs@br.ibm.com")
            .end()
          .sleep(5000)
          .findAllByClassName('user-list__user__avatar')
  				.then(function(el) {
  					el[usersNumber].click();
  				})
  				.end()
  				.sleep(2000)
          .findById('bulk-warning')
  				.then(
  					function(successful) {
  						assert.isOk(true, 'The user was added successfully!');
  					},
  					function(err) {
  						assert.isOk(false, 'This user is already member of this group. Operation Cancelled');
  					});
      });

      bdd.it('Should warn the user that the member is already on the list', function () {
        var usersNumber;

        this.remote
				.get(require.toUrl(groupUrl))
				.sleep(5000)
				.findAllByClassName('user-list')
				.then(function(users) {
					usersNumber = users.length;
				});

        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findById('add-User-Btn')
            .click()
            .end()
            .sleep(3000)
          .findDisplayedById('search-box')
            .click()
            .clearValue()
            .pressKeys("thiagogs@br.ibm.com")
            .end()
          .sleep(5000)
          .findAllByClassName('user-list__user__avatar')
  				.then(function(el) {
  					el[usersNumber].click();
  				})
  				.end()
  				.sleep(2000)
          .findById('bulk-warning')
  				.then(
  					function(successful) {
  						assert.isOk(true, 'This user is already member of this group. Operation Cancelled');
  					},
  					function(err) {
  						assert.isOk(false, 'The user was added successfully!');
  					});
      });
    });

    bdd.describe('Scenario 3: Removing a user', function () {
      bdd.it('Should not remove the user from the list', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findDisplayedById('rmv-button')
            .click()
            .end()
            .sleep(1000)
          .findDisplayedById('remove-cancel')
            .click()
            .end()
            .sleep(1000)
  				.findAllByClassName('user-list')
  				.then(function(users) {
  					usersNumber = users.length;
            assert.strictEqual(usersNumber, 1, 'Should have at least one user');
  				});
      });

      bdd.it('Should not remove the user from the list', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findDisplayedById('rmv-button')
            .click()
            .end()
            .sleep(1000)
          .findDisplayedById('remove-confirm')
            .click()
            .end()
            .sleep(1000)
          .findById('bulk-warning')
  				.then(
  					function(successful) {
  						assert.isOk(true, 'The user was removed successfully!');
  					},
  					function(err) {
  						assert.isOk(false, 'Could not remove this user!');
  					});
      });
    });

    bdd.describe('Scenario 4: search a user', function () {
      bdd.it('Should include an some users to the list of users', function() {
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(2000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'pre-users.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000);
      });

      bdd.it('Should return a message saying the users was not found', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findById('search-input-box')
            .click()
            .type("manueljoaquim@br.ibm.com")
            .end()
            .sleep(1000)
          .findById('search-User-Btn')
            .click()
            .end()
            .sleep(2000)
          .findById('bulk-warning')
          .then(
            function(successful) {
              assert.isOk(true, 'There is no match to the user you are looking.');
            },
            function(err) {
              assert.isOk(false, 'There is no match to the user you are looking.');
            });
      });

      bdd.it('Should return the user searched', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findDisplayedById('search-input-box')
            .click()
            .type("thiagogs@br.ibm.com")
            .end()
            .sleep(1000)
          .findDisplayedById('search-User-Btn')
            .click()
            .end()
            .sleep(1000)
            .findAllByClassName('user-list')
    				.then(function(users) {
    					assert.strictEqual(users.length, 1, 'There is more than one user in the list');
    				});
      });
    });

    bdd.describe('Scenario 4: Pagination', function () {
      bdd.it('Should display only one page the the pagination should be hidden', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findByClassName('pagination')
          .then(
            function(successful) {
              assert.isOk(false, 'Shouldn\'t have any pagination component');
            },
            function(err) {
              assert.isOk(true, 'There is no pagination component');
            });
      });

      bdd.it('Should list the first 50 entries in one page only', function() {
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(2000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'bulkpag.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000);
      });

      bdd.it('Should move to the last page of the screen and the last entry should start with Z', function () {
        return this.remote
          .get(require.toUrl(groupUrl))
          .sleep(4000)
          .findById('tab-users')
            .click()
            .end()
          .sleep(1000)
          .findAllByClassName('page-link')
            .then(function(el) {
              el[el.length-1].click();
            })
            .end()
          .sleep(5000)
          .findAllByClassName('user-list__user__info__email')
    				.then(function(users) {

              return users[users.length-1].getVisibleText();
            }).then(function(text){
    					assert.strictEqual(text, 'zumgjm46@br.ibm.com', text);
    				});
      });
    });
  });
});
