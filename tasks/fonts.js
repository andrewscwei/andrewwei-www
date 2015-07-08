/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Compiles and deploys fonts to the /.tmp directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('fonts', function()
{
    return gulp.src([config.paths.generated+'/assets/**/*.'+config.patterns.fonts])
        .pipe(gulp.dest(config.paths.tmp+'/assets'));
});
