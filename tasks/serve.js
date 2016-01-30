/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

import browserSync from 'browser-sync';
import config from './.taskconfig';
import gulp from 'gulp';
import $util from 'gulp-util';

/**
 * Serves the app locally. In production, watch option is not supported. This is meant for
 * development only.
 *
 * @param {Boolean} debug
 * @param {Number}  port
 * @param {Boolean} watch
 */
gulp.task('serve', () => {
  if (config.env.watch && !config.debug) {
    $util.log($util.colors.yellow('Watch is not supported in production. Please specify ') + '--debug' + $util.colors.yellow(' instead.'));
    return;
  }

  browserSync(config.serve.browserSync);

  // Watch for changes.
  if (config.env.watch) {
    var entries = config.watch.entries;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      gulp.watch(entry.files, entry.tasks);
    }
  }
});
