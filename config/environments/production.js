/**
 * ENVIRONMENTS/PRODUCTION
 * Will boot when NODE_ENV is "production"
 */

// Config files
const yamler = require('yamler');
const applicationConfig = yamler('config/application.yml').production;
const databaseConfig = yamler('config/database.yml').production;

// Boot express
require('./../initializers/express.js')(applicationConfig);

// Start the server
require('./../initializers/database.js')(databaseConfig);
