/*jshint esversion: 6 */
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {

    //consts from stub
    const baseUrl = testStub.baseUrl;
    const groupsUrl = testStub.groupsStub.groupsUrl;
    const invalidUrl = testStub.groupsStub.invalidUrl;
    const invalidBpUser = "09jha8sh@jhs.com";
    const validBpUser = "mateusp@br.ibm.com";

    // Behavioral description of your feature - this encapsulates all test for a feature
    bdd.describe('Groups', function () {

        bdd.before(function () {
            console.log('Beggining groups suite tests.');
        });

        bdd.after(function () {
            console.log('Finished groups suite tests.');
        });

        bdd.beforeEach(function () {
            // executes before each test
        });

        bdd.afterEach(function () {
            // executes after each test
        });
        
        bdd.describe('Navigating to valid URLs', function () {
            
            bdd.it('Should open the groups list', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + '/admin'))
                  .sleep(2000)
                  .findById('groups-link')
                      .click()
                      .end()
                  .sleep(500)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Groups');
                      });
            });

            bdd.it('Should open the new group page when clicking on the "New Group" button', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + groupsUrl))
                  .sleep(2000)
                  .findById('new-group')
                      .click()
                      .end()
                  .sleep(1000)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'New Group');
                      });
            });

            bdd.it('Should open the group details page when clicking on the group', function () {
              return this.remote
                .get(require.toUrl(baseUrl + groupsUrl))
                .sleep(4000)
                .findByClassName('group')
                  .click()
                  .end()
                .sleep(3000)
                .findById('channels')
                  .getVisibleText()
                  .then(function(text) {
                      assert.strictEqual(text, 'Channels');
                  });
            });

         });

        bdd.describe('Editing a group', function () {

            bdd.it('Should display the group information when entering the editing screen', function () {
                return this.remote
                    .findById('edit-group')
                        .click()
                        .end()
                    .sleep(5000)
                    .findById('groupName')
                        .getProperty('value').then(nameInputValue => {
                            assert.isString(nameInputValue, 'Group name is not present');
                        })
                        .end()
                    .findById('groupDescription')
                        .getProperty('value').then(descInputValue => {
                            assert.isString(descInputValue, 'Group description is not present');
                        })
                        .end()
                    .findAllByClassName('user-list__user').then(elements => {
                            assert.isArray(elements, 'No group owners array was found');
                            assert.isTrue(elements.length > 0, 'There are no group owners on the list');
                        })
                        .end();

            });

            bdd.it('Should open an input field to add a new owner when the "Add owner" button is clicked', function () {
                return this.remote
                    .findById('addOwner')
                        .click()
                        .end()
                    .sleep(1000)
                    .findById('bp-search')
                        .then(found => {
                            assert.isTrue(true, 'Input field to add a owner was found.');
                        }, notFound => {
                            assert.isTrue(false, 'Input field to add a owner was not found.');
                        });
            });

            bdd.it('Should display an error message if no results are found when searching for an invalid user', function () {
                return this.remote
                    .findById('search-box')
                        .clearValue()
                        .click()
                        .type(invalidBpUser)
                        .end()
                    .sleep(3000)
                    .findById('empty-answer')
                    .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'It looks like there is no bluepages user matching your search input :(', 'Error message is not displaying the correct text.');
                        });
            });

            bdd.it('Should add a new owner to the owners list after searching for a valid user and clicking on the result', function () {
                return this.remote
                    .findById('search-box')
                        .clearValue()
                        .click()
                        .type(validBpUser)
                        .end()
                    .sleep(3000)
                    .findAllByClassName('user-list__user__avatar')
                        .then(results => {
                            results[0].click()
                        })
                        .end()
                    .sleep(5000)
                    .findAllByClassName('user-list__user__avatar')
                        .then(owners => {
                            assert.isTrue(owners.length > 1, 'User was not added to the owners list');
                        });
            });

            bdd.it('Should not permit the removal of an owner if he is the only owner of the group', function () {
                return this.remote
                    .findAllByClassName('rmv-button')
                        .then(results => {
                            assert.isTrue(results.length < 1, 'There isn\'t one owner only.');
                        });
            });

            bdd.it('Should save any changes the user does to the group\'s name, description or owners list', function () {

                let _changedName = false;
                let _changedDescription = false;

                return this.remote
                    .findById('groupName')
                        .clearValue()
                        .type("NOVO NOME3")
                        .end()
                    .findById('groupDescription')
                        .clearValue()
                        .type("NOVA DESCRICAO3")
                        .end()
                    .findById('saveChangesBtn')
                        .click()
                        .end()
                    .sleep(5000)
                    .findByClassName('conthead__title__heading')
                        .getVisibleText()
                        .then(groupName => {
                            expect(groupName).to.equal("NOVO NOME3");
                        })
                        .end()
                    .findByClassName('conthead__title__description')
                        .getVisibleText()
                        .then(groupDesc => {
                            expect(groupDesc).to.equal("NOVA DESCRICAO3");
                        });

            });

        });

        bdd.describe('Archiving a group', function () {

            bdd.it('Should only display the "Archive Group" button if the user is an admin.', function () {
                return this.remote
                    .findById('edit-group')
                        .click()
                        .end()
                    .sleep(3000)
                    .findById('archive-group')
                    .isDisplayed(isDisplayed => {
                        assert.isTrue(isDisplayed, 'Archive group button is not being shown to the admin user');
                    });
            }); 

            bdd.it('Should display a confirmation message when the user clicks on the "Archive Group" button', function () {
                return this.remote
                    .findById('archive-group')
                        .click()
                        .end()
                    .sleep(1000)
                    .findByClassName('modal-dialog')
                        .then(found => {
                            assert.isOk(true, 'Confirmation is being shown when clicking the archive button');
                        }, notFound => {
                            assert.isOk(false, 'Confirmation is not being shown when clicking the archive button');
                        });

            });

            bdd.it('Should close the confirmation message and do nothing if the action is cancelled', function () {
                return this.remote
                    .findById('archive-group')
                        .click()
                        .end()
                    .sleep(2000)
                    .findByClassName('btn-secondary')
                        .click()
                        .end()
                    .sleep(1000)
                    .findByClassName('modal-dialog')
                        .then(found => {
                            assert.isOk(false, 'Confirmation is not being closed.');
                        }, notFound => {
                            assert.isOk(true, 'Confirmation is being closed.');
                        });
            });

            bdd.it('Should archive the group and return to the group list where the archived group will no longer be present', function () {

                let _previous = {};

                return this.remote
                    .refresh()
                    .sleep(4000)
                    .findById('groupName')
                        .getProperty('value').then(nameInputValue => {
                            _previous.name = nameInputValue;
                        })
                        .end()
                    .findById('archive-group')
                        .click()
                        .end()
                    .sleep(2000)
                    .findByClassName('btn-primary')
                        .click()
                        .end()
                    .sleep(5000)
                    .findAllByClassName('group__name').then(groupNames => {
                        let _groupNamesText = [];
                        groupNames.forEach(name => {
                            _groupNamesText.push(name.getVisibleText());
                        });
                        Promise.all(_groupNamesText).then(texts => {
                            let _archived = true;
                            texts.forEach(text => {
                                if (name == _previous.name){
                                    _archived = false; // The groups is still there
                                }
                            });
                            assert.isTrue(_archived, 'The archived group is still present on the groups list.');
                        });
                    });

            });

        });
        
        bdd.describe('Navigating to invalid URLs', function () {

            bdd.it('Should open the "Not Found" page when trying to access an invalid URL', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + invalidUrl))
                  .sleep(1000)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Oops! Page not found');
                      });
            });
            
            bdd.it('Should go back to the page the user was before if the back button is clicked', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + invalidUrl))
                  .sleep(1000)
                  .findById('back')
                      .click()
                      .end()
                  .sleep(1000)
                  .getCurrentUrl()
                      .then(function(url) {
                          assert.notStrictEqual(url, baseUrl + "/404");
                      });
            });
        
        });
    
    });
});
