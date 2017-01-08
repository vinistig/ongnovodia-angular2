/**
 * APP.JS - Main entry file
 * The app starts here. The current NODE_ENV will be booted.
 */

/**
 * Improve the require path. Controllers, models and helpers can
 * be required direclty, without the need of traversing the
 * relative path.
 *
 * This will work, anywhere on the app.
 * const controller = apprequire('controller/samples');
 *
 * To return a new instance without params, you can
 * const controller = newApprequire('controller/samples');
 */
global.apprequire = function(fileName) { return require(__dirname + '/app/' + fileName)};
global.newApprequire = function(fileName) { return new (require(__dirname + '/app/' + fileName))() };

/**
 * Boot the right environment based on NODE_ENV.
 */
const environment = process.env.NODE_ENV;

if (environment === 'production')
	require('./config/environments/production.js');

else if (environment === 'test')
	require('./config/environments/test.js');

else
	require('./config/environments/development.js');
