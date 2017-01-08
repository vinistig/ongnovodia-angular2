const gulp  = require('gulp');
const chalk = require('chalk');

let productionTask = function() {
	console.log(chalk.blue.bold('public/application.js bundle built'));
	console.log(chalk.blue.bold('public/application.css bundle built'));
}

gulp.task('production', ['browserify', 'css'], productionTask);
module.exports = productionTask;