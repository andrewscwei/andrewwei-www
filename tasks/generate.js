/**
 * (c) Andrew Wei
 */

import config from './.taskconfig';
import gulp from 'gulp';
import $util from 'gulp-util';
import { spawn } from 'child_process';

/**
 * Runs the Jekyll build taks to generate all the templates. These files are generated to the
 * /.tmp directory. Drafts are automatically built in debug environment.
 *
 * @param {Boolean} debug
 * @param {Boolean} watch
 */
gulp.task('generate', (callback) => {
  let proc;
  let callbackGuard = false;

  if (config.debug) {
    if (config.env.watch) {
      proc = spawn('bundle', ['exec' 'jekyll', 'build', '--drafts', '--watch', '--destination=' + config.paths.tmp]);
    } else {
      proc = spawn('bundle', ['exec', 'jekyll', 'build', '--drafts', '--destination=' + config.paths.tmp]);
    }
  } else {
    proc = spawn('bundle', ['exec', 'jekyll', 'build', '--destination=' + config.paths.tmp]);
  }

  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', function(data) {
    $util.log('\n' + data);

    // TODO: This is pretty hacky. Think of a better way?
    if (config.env.watch && (data && data.indexOf('Auto-regeneration:') > -1) && !callbackGuard) {
      callbackGuard = true;
      callback();
    }
  });

  proc.stderr.setEncoding('utf8');
  proc.stderr.on('data', function(data) {
    $util.log('\n' + data);
  });

  proc.on('exit', function(code) {
    if (code === 0) {
      callback();
    } else {
      return;
    }
  });
});
