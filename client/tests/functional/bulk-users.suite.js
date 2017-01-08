/*jshint esversion: 6 */
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (bdd, assert, expect, require, testStub) {
  this.timeout = 90000;

  bdd.describe('Bulk Users', function () {
    const baseUrl = testStub.baseUrl;
    const absolutePath = testStub.bulkUserStup.absolutePath + '/client/tests/stup-files/';

    var groupUrl; //since it uses a dinamically URL, I need to store from first time on.
    bdd.before(function () {
      console.log('##### DON\'T FORGET TO CHANGE THE ABSOLUTE PATH ON TEST STUP FOR YOUR PROJECT PLACE #####');
    });

    bdd.it('Getting the edit page of a channel', function() {
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

    bdd.describe('Negative Scenarios', function () {
      bdd.it('Should return an error reporting the empty file', function() {
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
          .type(absolutePath + 'importUsers-empty.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('bulk-warning')
        .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'Could not include any user, the file is empty!', 'Error is different than predicted');
          });
      });

      bdd.it('Should return an error reporting the file has no valid entries', function() {
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(1000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'importUsers-invalid.csv')
          .end()
        .sleep(1000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(2000)
        .findDisplayedById('bulk-warning')
        .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'No users were included, the selected file was invalid.', 'Error is different than predicted');
          });
      });

      bdd.it('Should return an error reporting the file has no break line', function() {
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(1000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'importUsers-fromExcel.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('bulk-warning')
        .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'No users were included, the file has no breakline (try to use different editor than MSExcel)', 'Error is different than predicted');
          });
      });
    });

    bdd.describe('Mixed Scenarios', function () {
      bdd.it('Should return there were some invalid entries and include only one entry', function() {
        var self = this;
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(1000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'importUsers-duplicated.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('bulk-warning')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'There were some invalid entries (duplicated or invalid) in the list, only valid entries were included.', text);
          })
          .end()
        .sleep(4000)
        .findByClassName('user-list__user__info__email')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'pedrolim@br.ibm.com', text);
          })
        .end();
      });

      bdd.it('Should return that only valid entries were included', function() {
        var self = this;
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(1000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'importUsers-messy.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('bulk-warning')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'Only valid e-mails that are not members of this group were included. Other entries were ignored', text);
          })
          .end()
        .sleep(4000)
        .findByClassName('user-list__user__info__email')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'mateusp@br.ibm.com', text);
          })
        .end()
        .sleep(1000)
        .findById('rmv-button')
          .click()
          .end()
          .sleep(1000)
        .findById('remove-confirm')
          .click()
          .end()
        .sleep(2000)
        .findByClassName('user-list__user__info__email')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'pedrolim@br.ibm.com', text);
          })
        .end()
        .sleep(1000)
        .findById('rmv-button')
          .click()
          .end()
          .sleep(1000)
        .findById('remove-confirm')
          .click()
          .end();
      });
    });

    bdd.describe('Positive Scenarios', function () {
      bdd.it('Should return that only valid entries were included', function() {
        var self = this;
        return this.remote
        .get(require.toUrl(groupUrl))
        .sleep(4000)
        .findById('tab-users')
          .click()
          .end()
        .sleep(1000)
        .findById('bulk-add')
          .click()
          .end()
        .sleep(1000)
        .findById('filename')
          .type(absolutePath + 'importUsers.csv')
          .end()
        .sleep(2000)
        .findById('upload-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('bulk-warning')
          .getVisibleText()
          .then(function(text) {
            assert.strictEqual(text, 'Users Imported successfully!', text);
          })
          .end()
        .sleep(4000)
        .findDisplayedById('rmv-button')
          .click()
          .end()
          .sleep(1000)
        .findDisplayedById('remove-confirm')
          .click()
          .end()
        .sleep(2000)
        .findDisplayedById('rmv-button')
          .click()
          .end()
          .sleep(1000)
        .findById('remove-confirm')
          .click()
          .end()
        .sleep(1000)
        .findDisplayedById('rmv-button')
          .click()
          .end()
          .sleep(1000)
        .findDisplayedById('remove-confirm')
          .click()
          .end();
      });
    });
  });
});
