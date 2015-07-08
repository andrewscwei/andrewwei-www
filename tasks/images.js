/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Compiles and deploys images to the /.tmp directory.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-imagemin
 */

var config = require('./config');
var gulp = require('gulp');
var $cache = require('gulp-cache');
var $if = require('gulp-if');
var $imagemin = require('gulp-imagemin');

gulp.task('images', function()
{
    return gulp.src([config.paths.generated+'/**/*'+config.patterns.images])
        .pipe($if(!config.env.skipImageMin, $cache($imagemin(
        {
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        }))))
        .pipe(gulp.dest(config.paths.tmp));
});
