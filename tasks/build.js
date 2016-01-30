/**
 * andrewwei.mu
 * (c) Andrew Wei <andrewscwei@gmail.com>
 */

import autoprefixer from 'autoprefixer';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import config from './.taskconfig';
import del from 'del';
import gulp from 'gulp';
import merge from 'merge-stream';
import source from 'vinyl-source-stream';
import through2 from 'through2';
import watchify from 'watchify';
import yamlify from 'yamlify';
import $concat from 'gulp-concat';
import $csso from 'gulp-csso';
import $if from 'gulp-if';
import $minifyHTML from 'gulp-minify-html';
import $postcss from 'gulp-postcss';
import $revAll from 'gulp-rev-all';
import $stylus from 'gulp-stylus';
import $size from 'gulp-size';
import $sourcemaps from 'gulp-sourcemaps';
import $uglify from 'gulp-uglify';
import $util from 'gulp-util';

/**
 * Compiles and deploys images.
 *
 * @param {Boolean} debug
 */
gulp.task('images', () => {
  return gulp.src(config.build.images.entry)
    .pipe($size({
      title: '[images]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.images.output));
});

/**
 * Compiles and deploys videos.
 */
gulp.task('videos', () => {
  return gulp.src(config.build.videos.entry)
    .pipe($size({
      title: '[videos]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.videos.output));
});

/**
 * Compiles and deploys fonts.
 */
gulp.task('fonts', () => {
  return gulp.src(config.build.fonts.entry)
    .pipe($size({
      title: '[fonts]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.fonts.output));
});

/**
 * Compiles and deploys stylesheets.
 *
 * @param {Boolean} css-sourcemaps
 * @param {Boolean} debug
 * @param {Boolean} skip-css-min
 */
gulp.task('styles', () => {
  return merge(
    gulp.src(config.build.styles.entry)
    .pipe($if(config.env.cssSourcemaps, $sourcemaps.init()))
    .pipe($stylus(config.build.styles.stylus).on('error', function(err) {
      $util.log($util.colors.red('[stylus] Error: ' + err.message));
      this.emit('end');
    }))
    .pipe($postcss([autoprefixer(config.build.styles.autoprefixer)]))
    .pipe($if(config.env.cssSourcemaps, $sourcemaps.write()))
    .pipe($size({
      title: '[styles:app]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.styles.output)),
    gulp.src(config.build.styles.vendorEntry)
    .pipe($concat(config.build.styles.vendorFileName))
    .pipe($if(!config.env.skipCSSMin, $csso()))
    .pipe($size({
      title: '[styles:vendor]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.styles.vendorOutput))
  );
});

/**
 * Compiles all JavaScript bundle files. This task assumes that all bundle files are located in /app/assets/js
 * and ignores all sub-directories. Watchify is used to speed up the rebundling process when watch is enabled.
 * Babelify is used to allow development in ES6 standards.
 *
 * @param {Boolean} debug
 * @param {Boolean} js-sourcemaps
 * @param {Boolean} skip-js-min
 * @param {Boolean} watch
 */
gulp.task('scripts', () => {
  function bundle(bundler, output, next) {
    return bundler.bundle()
      .on('error', function(err) {
        $util.log($util.colors.red('[browserify] Error: ' + err.message));

        if (next) {
          next();
        } else {
          this.emit('end');
        }
      })
      .pipe(source(output))
      .pipe(buffer())
      .pipe($if(config.env.jsSourcemaps, $sourcemaps.init({
        loadMaps: true
      })))
      .pipe($if(!config.env.skipJSMin, $uglify())).on('error', $util.log)
      .pipe($if(config.env.jsSourcemaps, $sourcemaps.write('./')))
      .pipe(gulp.dest(config.build.scripts.output));
  }

  return merge(
    gulp.src(config.build.scripts.entry)
    .pipe(through2.obj(function(file, enc, next) {
      let opts = {
        entries: [file.path],
        debug: config.debug,
        transform: [babelify, yamlify]
      };
      let bundler = (config.env.watch) ? watchify(browserify(opts)) : browserify(opts);
      let output = file.path.replace(file.base, '');

      if (config.env.watch) {
        bundler.on('time', function(time) {
          $util.log($util.colors.green('[browserify]'), output, $util.colors.magenta('in ' + time + 'ms'));
        });

        bundler.on('update', function() {
          bundle(bundler, output);
        });
      }

      bundle(bundler, output, next)
        .on('end', function() {
          next(null, file);
        });
    })),
    gulp.src(config.build.scripts.vendorEntry)
    .pipe($concat(config.build.scripts.vendorFileName))
    .pipe($if(!config.env.skipJSMin, $uglify()))
    .on('error', function(err) {
      $util.log($util.colors.red('Vendor scripts error: ' + err.message));

      this.emit('end');
    })
    .pipe($size({
      title: '[scripts:vendor]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.scripts.vendorOutput))
  );
});

/**
 * Processes all static files (i.e. images, stylesheets, scripts, etc) and deploys them.
 *
 * @param {Boolean} css-sourcemaps
 * @param {Boolean} debug
 * @param {Boolean} js-sourcemaps
 * @param {Boolean} skip-css-min
 * @param {Boolean} skip-js-min
 * @param {Boolean} watch
 */
gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts']);

/**
 * Processes all template files (i.e. HTML) and deploys them.
 *
 * @param {Boolean} debug
 * @param {Boolean} skip-html-min
 */
gulp.task('templates', () => {
  return gulp.src(config.build.templates.entry)
    .pipe($if(!config.env.skipHTMLMin, $minifyHTML(config.build.templates.minifyHTML)))
    .pipe($size({
      title: '[templates]',
      gzip: true
    }))
    .pipe(gulp.dest(config.build.templates.output));
});


/**
 * Builds the entire app with option to apply revisioning.
 *
 * @param {Boolean} debug
 * @param {Boolean} skip-rev
 */
gulp.task('build', ['templates', 'static'], (callback) => {
  if (config.env.skipRev) {
    callback();
    return;
  }

  let revAll = new $revAll(config.build.build.revAll);
  let stream = gulp.src(config.build.build.entry)
    .pipe(revAll.revision())
    .pipe(gulp.dest(config.build.build.output))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(config.build.build.output));

  stream.on('end', function() {
    let manifestFile = config.build.build.output + '/rev-manifest.json';
    let manifest = require(manifestFile);
    let arr = [];

    for (let f in manifest) {
      if (f !== manifest[f]) {
        arr.push(config.build.build.output + '/' + f);
      }
    }

    arr.push(manifestFile);

    del(arr).then(function(paths) {
      callback();
    });
  });
});
