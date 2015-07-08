/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Compiles and deploys videos to the /.tmp directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('videos', function()
{
    return gulp.src([config.paths.generated+'/**/*'+config.patterns.videos])
        .pipe(gulp.dest(config.paths.tmp));
});
