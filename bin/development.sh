#!/bin/bash

node ./node_modules/gulp/bin/gulp.js development --silent &
node ./node_modules/nodemon/bin/nodemon.js app.js -q
