/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 *
 * This file only contains the default task. See ./tasks for individual sub-tasks. To add a new
 * sub-task, create new file in ./tasks and require it here. For task configurations, see ./tasks/config.js.
 */

import config from './tasks/.taskconfig';
import gulp from 'gulp';
import sequence from 'run-sequence';

import './tasks/clean';
import './tasks/generate';
import './tasks/build';
import './tasks/serve';

/**
 * Default Gulp task. This is the task that gets executed when you run the shell command 'gulp'.
 * This task will wipe the compiled files and rebuild everything, with on-complete options such
 * as serving and watching files for changes.
 *
 * @param {Boolean} debug
 * @param {Boolean} skipImageMin
 * @param {Boolean} skipCSSO
 * @param {Boolean} skipUglify
 * @param {Boolean} skipRev
 * @param {Boolean} skipHTML
 * @param {Boolean} serve
 * @param {Number}  port
 * @param {Boolean} watch
 */
gulp.task('default', (callback) => {
  let seq = ['clean', 'generate', 'build'];
  if (config.env.serve) seq.push('serve');
  seq.push(callback);
  sequence.apply(null, seq);
});
