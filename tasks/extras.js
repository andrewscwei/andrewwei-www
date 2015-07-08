/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Compiles and deploys misc files to the /.tmp directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('extras', function()
{
    return gulp.src([config.paths.generated+'/**/*.'+config.patterns.extras])
        .pipe(gulp.dest(config.paths.tmp));
});
