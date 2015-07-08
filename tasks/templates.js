/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Processes all template files (i.e. HTML) and deploys them to the /.tmp and /public directories.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-minify-html
 */

var config = require('./config');
var gulp = require('gulp');
var $if = require('gulp-if');
var $minifyHTML = require('gulp-minify-html');

gulp.task('templates', function(callback)
{
    return gulp.src([config.paths.generated+'/**/*.'+config.patterns.templates])
            .pipe($if(!config.env.skipMinifyHTML, $minifyHTML({empty: true, conditionals: true, loose: true })))
            .pipe(gulp.dest(config.paths.tmp))
            .pipe(gulp.dest(config.paths.build));
});
