/*jshint esversion: 6 */
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {
    bdd.describe('New Channel', function () {
      const baseUrl = testStub.baseUrl;
      const groupUrl = testStub.groupsStub.groupsUrl;

      const object = [
        {name: testStub.newChannelStub.name + Math.random().toString().substring(2, 6), description: testStub.newChannelStub.texts.description},
        {name: testStub.newChannelStub.name + Math.random().toString().substring(6, 10), description: testStub.newChannelStub.texts.description},
      ];

      var newChannelUrl; //since it uses a dinamically URL, I need to store from first time on.

      bdd.describe('Negative Scenarios', function() {
        bdd.it('Should disable the Create channel button if the fields are left blank.', function() {
          return this.remote
            .get(require.toUrl(baseUrl + '/groups'))
            .sleep(5000)
            .findByClassName('group')
              .click()
              .end()
            .sleep(2000)
            .findById('new-channel')
              .click()
              .end()
            .sleep(2000)
            .findById('newChannelBtn')
              .isEnabled()
              .then(function(status) {
                  assert.strictEqual(status, false, "Button is not disabled.");
              })
              .getCurrentUrl()
              .then(function(text) {
                assert.notEqual(text, '', text);
                newChannelUrl = text;
              });
        });

        bdd.it('should show a error message if the Name field is left blank', function() {
          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('name')
              .click()
              .end()
            .findById('description')
              .click()
              .end()
            .sleep(2000)
            .findDisplayedByClassName('errorMessage')
              .getVisibleText()
              .then(function(text) {
                  assert.strictEqual(text, '* This field is required!', text);
              });
        });

        bdd.it('should show a error message if the Description field is left blank', function() {
          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('description')
              .click()
              .end()
            .findById('name')
              .click()
              .end()
            .sleep(2000)
            .findDisplayedByClassName('errorMessage')
              .getVisibleText()
              .then(function(text) {
                assert.strictEqual(text, '* This field is required!', text);
              });
        });

        bdd.it('should be at most 255 characters', function() {
          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('description')
              .click()
              .clearValue()
              .type(object[0].description)
              .sleep(2000)
              .getAttribute("ng-reflect-model")
              .then(function(val) {
                assert.strictEqual(255, val.length, 'Has passed 255 characters');
              })
              .end();
        });
      });

      bdd.describe('Positive Scenarios', function() {
        bdd.it('should add a new channel filling only the required fields', function() {
          var channelCreated = false;

          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('name')
              .click()
              .type(object[0].name)
              .end()
            .findById('description')
              .click()
              .type(object[0].description.substring(0, 100))
              .end()
            .sleep(2000)
            .findById('newChannelBtn')
              .click()
              .end()
            .sleep(5000)
            .findAll('class name', 'channel__name')
            .then(function(elements) {
              var array = [];
              elements.forEach(function(el) {
                  array.push(el.getVisibleText());
              });
              return Promise.all(array);
            }).then(function(resultsArray) {
              resultsArray.forEach(function(text) {
                text.trim();
                if(text === object[0].name) {
                  channelCreated = true;
                }
              });
              assert.strictEqual(channelCreated, true, 'The channel was not created.');
            }).catch(function(err){
              assert.strictEqual(channelCreated, true, 'The channel was not created.');
            });
        });

        bdd.it('should add a new channel filling only the required fields', function() {
          var channelCreated = false;

          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('name')
              .click()
              .type(object[1].name)
              .end()
            .findById('description')
              .click()
              .type(object[1].description.substring(0, 100))
              .end()
            .findById('isPrivate')
              .click()
              .end()
            .findById('isPrimary')
              .click()
              .end()
            .sleep(2000)
            .findById('newChannelBtn')
              .click()
              .end()
            .sleep(5000)
            .findAll('class name', 'channel__name')
            .then(function(elements) {
              var array = [];
              elements.forEach(function(el) {
                  array.push(el.getVisibleText());
              });
              return Promise.all(array);
            }).then(function(resultsArray) {
              resultsArray.forEach(function(text) {
                text.trim();
                if(text === object[1].name) {
                  channelCreated = true;
                }
              });
              assert.strictEqual(channelCreated, true, 'The channel was not created.');
            }).catch(function(err){
              assert.strictEqual(channelCreated, true, 'The channel was not created.');
            });
        });
      });

      bdd.describe('Duplicated Scenario', function() {
        bdd.it('Should warn the user that the group already exists', function() {
          return this.remote
            .get(require.toUrl(newChannelUrl))
            .sleep(5000)
            .findById('name')
              .click()
              .type(object[1].name)
              .end()
            .findById('description')
              .click()
              .type(object[1].description.substring(0, 100))
              .end()
            .sleep(2000)
            .findById('newChannelBtn')
              .click()
              .end()
            .sleep(5000)
            .findById('duplicated-warning')
            .getVisibleText()
            .then(function(text) {
              assert.strictEqual(text, "Oops! The channel '" + object[1].name + "' is already stored on the application. Please change the name of the channel and try again.");
            });
        });
      });
    });
});
