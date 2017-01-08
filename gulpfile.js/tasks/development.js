const gulp  = require('gulp');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const chalk = require('chalk');

let developmentTask = function() {
	watch(['./app/views/**/*.css', './app/assets/styles'], 
		batch((events, done) => {
			gulp.start('css', done);
			console.log(chalk.blue.bold('CSS rebuilt'));
		})
	);
}

gulp.task('development', developmentTask);
module.exports = developmentTask;