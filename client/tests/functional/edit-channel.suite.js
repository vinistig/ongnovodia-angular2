/*jshint esversion: 6 */
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {
  this.timeout = 90000;
    bdd.describe('Edit and Archive Channel', function () {
      const baseUrl = testStub.baseUrl;
      const groupUrl = testStub.groupsStub.groupsUrl;

      const object = [
        {name: '00011122233356789 - AAA - ' + testStub.editChannelStub.name + Math.random().toString().substring(2, 6) + ' - Edited', description: testStub.editChannelStub.texts.description + ' - Edited'},
        {name: '00011122233356789 - AAA - ' + testStub.editChannelStub.name + Math.random().toString().substring(6, 10) + ' - Edited', description: testStub.editChannelStub.texts.description + ' - Edited'},
      ];

      var editChannelUrl; //since it uses a dinamically URL, I need to store from first time on.
      bdd.it('should land on the admin panel if the user has permission to access it and his credentials are correct.', function () {

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
                  .pressKeys("ibm04ibm")
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

      bdd.it('Getting the edit page of a channel', function() {
        var self = this;

        var channelEdited = false;
        var tmpName = '00011122233356789 - AAA - Name';

        return this.remote
        .get(require.toUrl(baseUrl + '/groups'))
        .sleep(4000)
        .findByClassName('group')
          .click()
          .end()
        .sleep(1000)
        .findById("new-channel")
          .click()
          .end()
        .sleep(1000)
        .findById('name')
          .click()
          .type(tmpName)
          .end()
        .findById('description')
          .click()
          .type(tmpName + ' + Description')
          .end()
        .findById('isPrivate')
          .click()
          .end()
        .findById('newChannelBtn')
          .click()
          .end()
        .sleep(4000)
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
            if(text === tmpName) {
              channelEdited = true;
            }
          });

          if (channelEdited===true) {
            return self.remote
            .get(require.toUrl(baseUrl + '/groups'))
            .sleep(4000)
            .findByClassName('group')
              .click()
              .end()
            .sleep(1000)
            .findByClassName('channel')
              .click()
              .end()
            .sleep(1000)
            .findById('editChannelBtn')
              .click()
              .end()
            .sleep(1000)
            .getCurrentUrl()
              .then(function(text) {
                editChannelUrl = text;
                assert.notEqual(editChannelUrl, '', editChannelUrl);
              });
          } else {
            assert.strictEqual(channelEdited, true, 'The channel was not created.');
          }
        }).catch(function(err){
          assert.notEqual(editChannelUrl, '', err);
        });
      });


      bdd.describe('Edit Channel - Negative Scenarios', function() {
        bdd.it('should show a error message if the Name field is left blank', function() {
          console.log(editChannelUrl);
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('name')
              .click()
              .clearValue()
              .type('a\uE003')
              .end()
            .findById('description')
              .click()
              .end()
            .sleep(900)
            .findDisplayedByClassName('errorMessage')
              .getVisibleText()
              .then(function(text) {
                  assert.strictEqual(text, '* This field is required!', text);
              });
        });

        bdd.it('should show a error message if the Description field is left blank', function() {
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('description')
              .click()
              .clearValue()
              .type('a\uE003')
              .end()
            .findById('name')
              .click()
              .end()
            .sleep(900)
            .findDisplayedByClassName('errorMessage')
              .getVisibleText()
              .then(function(text) {
                assert.strictEqual(text, '* This field is required!', text);
              });
        });

        bdd.it('should be at most 255 characters', function() {
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('description')
              .click()
              .clearValue()
              .type(object[0].description)
              .sleep(1000)
              .getAttribute("ng-reflect-model")
              .then(function(val) {
                assert.strictEqual(255, val.length, 'Has passed 255 characters');
              })
              .end();
        });

        bdd.it('isPrivate property should be disabled', function() {
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findByName('isPrivate')
              .isEnabled()
                .then(function(status) {
                    assert.strictEqual(status, false, "Field is not disabled.");
                })
              .end();
        });
      });

      bdd.describe('Edit Channel - Positive Scenarios', function() {
        bdd.it('should edit the channel filling only the required fields', function() {
          var channelEdited = false;

          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('name')
              .click()
              .clearValue()
              .type(object[0].name)
              .end()
            .findById('description')
              .click()
              .clearValue()
              .type(object[0].description.substring(0, 100))
              .end()
            .sleep(1000)
            .findById('newChannelBtn')
              .click()
              .end()
            .sleep(4000)
            .get(require.toUrl(baseUrl + '/groups'))
            .sleep(4000)
            .findByClassName('group')
              .click()
              .end()
            .sleep(1000)
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
                  channelEdited = true;
                }
              });
              assert.strictEqual(channelEdited, true, 'The channel was not created.');
            }).catch(function(err){
              assert.strictEqual(channelEdited, true, 'The channel was not created.');
            });
        });

        bdd.it('should add a new channel filling all fields', function() {
          var channelEdited = false;

          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('name')
              .click()
              .clearValue()
              .type(object[1].name)
              .end()
            .findById('description')
              .click()
              .clearValue()
              .type(object[1].description.substring(0, 100))
              .end()
            .findById('isPrimary')
              .click()
              .end()
            .sleep(1000)
            .findById('newChannelBtn')
              .click()
              .end()
            .sleep(4000)
            .get(require.toUrl(baseUrl + '/groups'))
            .sleep(4000)
            .findByClassName('group')
              .click()
              .end()
            .sleep(4000)
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
                  channelEdited = true;
                }
              });
              assert.strictEqual(channelEdited, true, object[1].name);
            }).catch(function(err){
              assert.strictEqual(channelEdited, true, object[1].name);
            });
        });
      });

      bdd.describe('Edit Channel - Duplicated Scenario', function() {
        bdd.it('Should warn the user that the group already exists', function() {
          var channelEdited = false;

          return this.remote
          .get(require.toUrl(baseUrl + '/groups'))
          .sleep(4000)
          .findByClassName('group')
            .click()
            .end()
          .sleep(1000)
          .findById("new-channel")
            .click()
            .end()
          .sleep(1000)
          .findById('name')
            .click()
            .clearValue()
            .type('This is Duplicated')
            .end()
          .findById('description')
            .click()
            .clearValue()
            .type(object[0].description.substring(0, 100))
            .end()
          .sleep(1000)
          .findById('newChannelBtn')
            .click()
            .end()
          .sleep(4000)
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
              if(text === 'This is Duplicated') {
                channelEdited = true;
              }
            });

            if (channelEdited) {
              return this.remote
                .get(require.toUrl(editChannelUrl))
                .sleep(4000)
                .findById('name')
                  .click()
                  .clearValue()
                  .type('This is Duplicated')
                  .end()
                .findById('description')
                  .click()
                  .clearValue()
                  .type(object[1].description.substring(0, 100))
                  .end()
                .sleep(1000)
                .findById('newChannelBtn')
                  .click()
                  .end()
                .sleep(4000)
                .findById('duplicated-warning')
                .getVisibleText()
                .then(function(text) {
                  assert.strictEqual(text, "Oops! The channel '" + object[1].name + "' is already stored on the application. Please change the name of the channel and try again.");
                });
            } else {
              assert.strictEqual(channelEdited, true, 'The channel was not created.');
            }
          }).catch(function(err){
            assert.strictEqual(channelEdited, true, 'The channel was not created.');
          });
        });
      });

      bdd.describe('Archive Channel - Scenarios', function () {
        bdd.it('Should cancel the confirmation screen', function() {
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('archiveChannel')
              .click()
              .end()
            .findDisplayedById('archive-cancel')
              .click()
              .end()
            .sleep(1000)
            .getCurrentUrl()
              .then(function(text) {
                assert.strictEqual(text, editChannelUrl, text);
              });
        });

        bdd.it('Should confirm the confirmation screen', function() {
          return this.remote
            .get(require.toUrl(editChannelUrl))
            .sleep(4000)
            .findById('archiveChannel')
              .click()
              .end()
            .findDisplayedById('archive-confirm')
              .click()
              .end()
            .sleep(1000)
            .getCurrentUrl()
              .then(function(text) {
                assert.notEqual(text, editChannelUrl, text);
              });
        });
      });
  });


});
