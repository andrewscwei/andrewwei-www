/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Processes all static files (i.e. images, stylesheets, scripts, etc) and deploys them to the /.tmp directory.
 *  These static files are then deployed to the /public directory. Option to append version hash to the end
 *  of the supported files.
 *
 *  @param {Boolean} --debug
 *  @param {Boolean} --skip-rev
 */

var config = require('./config');
var gulp = require('gulp');
var merge = require('merge-stream');
var $if = require('gulp-if');
var $rev = require('gulp-rev');
var $size = require('gulp-size');

gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts', 'extras'], function()
{
    return merge
    (
        gulp.src([config.paths.tmp+'/**/*.'+config.patterns.extras])
            .pipe(gulp.dest(config.paths.build)),
        gulp.src([config.paths.tmp+'/assets/**/*.'+config.patterns.images, config.paths.tmp+'/assets/**/*.'+config.patterns.videos, config.paths.tmp+'/assets/**/*.'+config.patterns.fonts, config.paths.tmp+'/assets/**/*.'+config.patterns.styles, config.paths.tmp+'/assets/**/*.'+config.patterns.scripts])
            .pipe($if(!config.env.skipRev, $rev()))
            .pipe(gulp.dest(config.paths.build+'/assets'))
            .pipe($size({ title: 'build', gzip: true }))
            .pipe($if(!config.env.skipRev, $rev.manifest()))
            .pipe($if(!config.env.skipRev, gulp.dest(config.paths.tmp))),
        gulp.src([config.paths.tmp+'/*.'+config.patterns.images, config.paths.tmp+'/**/*.'+config.paths.sourcemaps])
            .pipe(gulp.dest(config.paths.build))
    );
});
