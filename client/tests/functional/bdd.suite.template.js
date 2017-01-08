
define(['intern!bdd', 'intern/chai!assert', 'intern/chai!expect', 'require'], function (bdd, assert, expect, require) {
    
    // Behavioral description of your feature - this encapsulates all test for a feature
    bdd.describe('MyFeature', function () {

        bdd.before(function () {
            // Executes before it all begins
        });
        
        bdd.after(function () {
            // Executes after it all ends
        });
        
        bdd.beforeEach(function () {
            // Executes before each test
        });
        
        bdd.afterEach(function () {
            // Executes after each test
        });

        bdd.describe('BDD Test Scenario #1 - Error when trying to do something', function () {

            bdd.it('should do something if some condition is met.', function () {
                // Test code
            });

            bdd.it('should do something if some condition is met.', function () {
                // Test code
            });

        });

        bdd.describe('BDD Test Scenario #2 - Success when trying to do something', function () {

            bdd.it('should do something if some condition is met.', function () {
                // Test code
            });

            bdd.it('should do something if some condition is met.', function () {
                // Test code
            });

        });

    });
});