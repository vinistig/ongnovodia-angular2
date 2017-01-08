/*jshint esversion: 6 */
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require'], function (bdd, assert, expect, require) {

    const baseUrl = 'http://localhost:3000/#';

    // Behavioral description of your feature - this encapsulates all test for a feature
    bdd.describe('Channels', function () {
        bdd.describe('Navigate through all links that belongs to the groups feature', function () {
            bdd.it('Should be redirected to a group details page and show a list of channels', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + '/groups'))
                  .sleep(1000)
                  .findByClassName('group')
                      .click()
                      .end()
                  .sleep(500)
                  .findById('channels')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Channels');
                      });
            });
            bdd.it('Should be redirected to a Not Found page when pressing the Channel Box for details', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + '/groups'))
                  .sleep(1000)
                  .findByClassName('group')
                      .click()
                      .end()
                  .sleep(500)
                  .findByClassName('channel')
                      .click()
                      .end()
                  .sleep(500)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Oops! Page not found');
                      });
            });
            bdd.it('Should be redirected to a new channel page when pressing the New Channel button', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + '/groups'))
                  .sleep(1000)
                  .findById('new-group')
                      .click()
                      .end()
                  .sleep(500)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Oops! Page not found');
                      });
            });
            bdd.it('Should be redirected to a edit group page when pressing the Edit button', function () {
              return this.remote
                  .get(require.toUrl(baseUrl + '/groups'))
                  .sleep(1000)
                  .findById('edit-group')
                      .click()
                      .end()
                  .sleep(500)
                  .findByTagName('h1')
                      .getVisibleText()
                      .then(function(text) {
                          assert.strictEqual(text, 'Oops! Page not found');
                      });
            });
        });

    });
});
