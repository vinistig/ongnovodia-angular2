
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {
    bdd.describe('New Group', function () {

        var groupCreated = false;

        //consts from stub
        const baseUrl = testStub.baseUrl;
        const newGroupUrl = testStub.newGroupStub.newGroupsUrl;
        const groupName = testStub.newGroupStub.groupName;
        const descriptionText = testStub.newGroupStub.texts.descriptionText;
        const validNonAdminUser = testStub.newGroupStub.validNonAdminUser;
        const invalidNonAdminUser = testStub.newGroupStub.invalidNonAdminUser;

        bdd.before(function () {
            console.log('Beggining new-group suite tests.');
        });
        
        bdd.after(function () {
            console.log('Finished new-group suite tests.');
        });
        
        bdd.beforeEach(function () {
            // executes before each test
        });
        
        bdd.afterEach(function () {
            // executes after each test
        });

        bdd.describe('Group Creation Input Fields', function() {
            
            bdd.it('should disable the Create Group button if the fields are left blank.', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(2000)
                    .findById('newGroupBtn')
                        .isEnabled()
                        .then(function(status) {
                            assert.strictEqual(status, false, "Button is not disabled.");
                        });
            });

            bdd.it('should show a error message if the Name field is left blank', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('groupName')
                        .click()
                        .end()
                    .findById('description')
                        .click()
                        .end()
                    .sleep(900)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Group name is required', 'Error message is not displaying the correct text');
                        });
            });

            bdd.it('should show a error message if the Description field is left blank', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('description')
                        .click()
                        .end()
                    .findById('groupName')
                        .click()
                        .end()
                    .sleep(900)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Group description is required', 'Error message is not displaying the correct text');
                        });
            });

            bdd.it('should be at most 255 characters', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('description')
                        .click()
                        .clearValue()
                        .type(descriptionText)
                        .getAttribute("ng-reflect-model")
                        .then(function(val) {
                            assert.strictEqual(255, val.length, 'Has passed 255 characters');
                        })
                        .end();
            });
        });

        bdd.describe('Group Owners', function() {
            bdd.it('should not exists the remove button if have only one owner.', function() {
                var usersNumber;

                this.remote
                .sleep(2000)
                .get(require.toUrl(baseUrl + newGroupUrl))
                .findAllByClassName('user-list__user')
                .then(function(users) {
                    usersNumber = users.length;
                });

                return this.remote
                .sleep(5000)
                .get(require.toUrl(baseUrl + newGroupUrl))
                .findById('rmv-button')
                .then(
                    function(successful) {
                        if(usersNumber == 1) {
                            assert.isOk(false, 'Remove button should not exist if we have only one admin');
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

            bdd.it('should show the bluepages search field.', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('addOwner')
                        .click()
                        .end()
                    .findById('search-box')
                        .then(function() {
                            assert.isOk(true, 'Bluepages field does not exist when we click in add owner button.');
                        });

            });

            bdd.it('should add a new owner.', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('addOwner')
                        .click()
                        .end()
                    .findById('search-box')
                        .click()
                        .type(validNonAdminUser.email)
                        .sleep(3000)
                        .end()
                    .findAllByClassName('user-list__user__avatar')
                        .then(function(el) {
                            el[1].click()
                        })
                        .end()
                    .sleep(1000)
                    .findAllByClassName('user-list__user__avatar')
                        .then(function(el) {
                            assert.strictEqual(el.length, 2, 'The owner is not added.');
                        })
            });

            bdd.it('should show a error message if the bluepages id is invalid', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('addOwner')
                        .click()
                        .end()
                    .findById('search-box')
                        .click()
                        .type(invalidNonAdminUser.email)
                        .sleep(3000)
                        .end()
                    .findById('empty-answer')
                    .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'It looks like there is no bluepages user matching your search input :(', 'Error message is not displaying the correct text.');
                        });
            });

            bdd.it('should remove an owner.', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('addOwner')
                        .click()
                        .end()
                    .findById('search-box')
                        .click()
                        .type(validNonAdminUser.email)
                        .sleep(3000)
                        .end()
                    .findAllByClassName('user-list__user__avatar')
                        .then(function(el) {
                            el[1].click()
                        })
                        .end()
                    .sleep(2000)
                    .findById('rmv-button')
                        .click()
                        .end()
                    .findAllByClassName('user-list__user__avatar')
                        .then(function(el) {
                            assert.strictEqual(el.length, 1, 'The owner is not removed.');
                        })
                        .end();

                    
            });
        });

        bdd.describe('Successfully Group Creation', function() {
            bdd.it('should add a new group', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('groupName')
                        .click()
                        .type(groupName)
                        .end()
                    .findById('description')
                        .click()
                        .type('Intern Group Description Test')
                        .end()
                    .findById('newGroupBtn')
                        .click()
                        .end()
                    .sleep(5000)
                    .findAll('class name', 'group__name')
                    .then(function(elements) {
                        var array = [];
                        elements.forEach(function(el) {
                            array.push(el.getVisibleText());
                        });
                        return Promise.all(array);
                    }, function(notFound) {
                        assert.isTrue(false, 'Could not find any groups on the list.');
                    }).then(function(resultsArray) {
                        resultsArray.forEach(function(text) {
                            text.trim();
                            if(text === groupName) {
                                groupCreated = true;
                            }
                        });
                        assert.isTrue(groupCreated, 'The group was not created.');
                    }, function(err){
                        assert.isTrue(false, 'Could not find any visible text of the groups on the list.');
                    });
            });
        });

        bdd.describe('Cancel Group Creation', function() {

            bdd.it('should back to the home view and not create a new group.', function() {
                return this.remote
                    .get(require.toUrl(baseUrl + newGroupUrl))
                    .sleep(3000)
                    .findById('cancel')
                        .click()
                        .end()
                    .sleep(5000)
                    .getCurrentUrl()
                    .then(function(url){
                        assert.strictEqual(url, require.toUrl(baseUrl + 'groups'), 'The home view is not displayed.');
                    });
            });
        });
    });  
});
