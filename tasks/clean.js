/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

import config from './.taskconfig';
import del from 'del';
import gulp from 'gulp';

/**
 * Cleans /.tmp and /public directories.
 */
gulp.task('clean', (callback) => {
  del(config.clean.entry).then((paths) => callback());
});
