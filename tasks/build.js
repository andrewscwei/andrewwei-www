/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 * 	Builds the entire app from /app -> /.generated -> /.tmp -> /public.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-rev
 */

var config = require('./config');
var gulp = require('gulp');
var $revReplace = require('gulp-rev-replace');

gulp.task('build', ['templates', 'static'], function()
{
    if (!config.env.skipRev)
    {
        return gulp.src([config.paths.build+'/**/*.'+config.patterns.styles, config.paths.build+'/**/*.'+config.patterns.scripts, config.paths.build+'/**/*.'+config.patterns.templates])
            .pipe($revReplace({ manifest: gulp.src(config.paths.tmp+'/rev-manifest.json') }))
            .pipe(gulp.dest(config.paths.build));
    }
    else
    {
        return;
    }
});
