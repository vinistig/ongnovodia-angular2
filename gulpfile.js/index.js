/*
  Asset Pipeline for Ike.
  Based on the Gulp Starter from Viget
  https://github.com/vigetlabs/gulp-starter
*/

var requireDir = require('require-dir');

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true })