/* jshint strict:false */
/**
 *  andrewwei.mu
 *  (c) Andrew Wei <andrewscwei@gmail.com>
 *
 *  Cleans /.generated, /.tmp and /public
 *  directories.
 */

var config = require('./config');
var gulp = require('gulp');
var $cache = require('gulp-cache');

gulp.task('clean', function(callback)
{
    require('del')([config.paths.generated, config.paths.tmp, config.paths.build]).then(function(paths)
    {
        $cache.clearAll(callback);
    });
});
