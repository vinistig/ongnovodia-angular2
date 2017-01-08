define(['intern', 'intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require', '../test.stub'], function (intern, bdd, assert, expect, require, testStub) {
    bdd.describe('Login', function () {

        //consts from stub
        const baseUrl                   = testStub.baseUrl; 
        const validIntranetId           = testStub.validAdmin.email;
        const validPassword             = intern.args.bbPassword;
        const invalidIntranetId         = testStub.loginStub.invalidAdminUser.email;
        const invalidPassword           = testStub.loginStub.invalidAdminUser.password;
        const notPermittedIntranetId    = intern.args.nonAdminEmail;
        const notPermittedPassword      = intern.args.nonAdminPassword;
        const invalidEmail              = testStub.loginStub.invalidEmailFormat.email;

        bdd.before(function () {
            console.log('Beggining login suite tests.');
        });
        
        bdd.after(function () {
            console.log('Finished login suite tests.');
        });
        
        bdd.beforeEach(function () {
            // executes before each test
        });
        
        bdd.afterEach(function () {
            // executes after each test
        });

        bdd.describe('Credential error when trying to log in', function () {
            bdd.it('should disable the Login button if the fields are left blank.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('loginButton')
                        .isEnabled()
                        .then(function(status) {
                            assert.strictEqual(status, false, "Button is not disabled.");
                        });
            });

            bdd.it('should show an error message if the email format is invalid.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findByName('intranetId')
                        .click()
                        .clearValue()
                        .pressKeys(invalidEmail)
                        .end()
                    .findById('password')
                        .click()
                        .end()
                    .sleep(900)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Email is invalid', 'Error message is not displaying the correct text');
                        });
            });

            bdd.it('should show an error message if the email field is left blank.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('intranetId')
                        .click()
                        .end()
                    .findById('password')
                        .click()
                        .end()
                    .sleep(900)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Email is required', 'Error message is not displaying the correct text');
                        });
            });

            bdd.it('should show an error message if the password field is left blank.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('password')
                        .click()
                        .end()
                    .findById('intranetId')
                        .click()
                        .end()
                    .sleep(900)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Password is required', 'Error message is not displaying the correct text');
                        });
            });

            bdd.it('should show an error message if the authentication failed.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('intranetId')
                        .click()
                        .clearValue()
                        .pressKeys(invalidIntranetId)
                        .end()
                    .findById('password')
                        .click()
                        .clearValue()
                        .pressKeys(invalidPassword)
                        .end()
                    .findById('loginButton')
                        .click()
                        .end()
                    .sleep(6000)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Credentials invalid! Please, try again.', 'Error message is not displaying the correct text');
                        });
            });
        });

        bdd.describe('Permission error when trying to log in', function () {
            bdd.it('should show an error message if the user has no permission to access the admin panel.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('intranetId')
                        .click()
                        .clearValue()
                        .pressKeys(notPermittedIntranetId)
                        .end()
                    .findById('password')
                        .click()
                        .clearValue()
                        .pressKeys(notPermittedPassword)
                        .end()
                    .findById('loginButton')
                        .click()
                        .end()
                    .sleep(6000)
                    .findDisplayedById('errorMessage')
                        .getVisibleText()
                        .then(function(text) {
                            assert.strictEqual(text, 'Oops! It seems you do not have permission to access this. :(', 'Error message is not displaying the correct text');
                        });
            });
        });

        bdd.describe('Successful login', function () {
            bdd.it('should land on the admin panel if the user has permission to access it and his credentials are correct.', function () {
                return this.remote
                    .get(require.toUrl(baseUrl + 'login'))
                    .sleep(3000)
                    .findById('intranetId')
                        .click()
                        .clearValue()
                        .pressKeys(validIntranetId)
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
        });
    });
});