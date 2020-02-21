const path = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const postcssModules = require('postcss-modules');
const { files, babelNodeConfig, babelConfig, css, classNames } = require('./utils');

/* 拷贝pug文件 */
function pugProject() {
  return gulp.src(files.pug[0])
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      locals: { css, classNames, timeStr: '' }
    }))
    .pipe(gulp.dest(files.pug[1]));
}

/* sass */
function sassProject() {
  return gulp.src(files.sass[0])
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      postcssModules({
        generateScopedName: '[path][name]__[local]___[hash:base64:6]'
      })
    ]))
    .pipe(gulp.dest(files.sass[1]));
}

/* js */
function jsProject() {
  return gulp.src(files.js[0])
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(files.js[1]));
}

/* files */
function filesProject() {
  return gulp.src(files.files[0])
    .pipe(gulp.dest(files.files[1]));
}

/* server */
function serverProject() {
  return gulp.src(files.server[0])
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(babel(babelNodeConfig))
    .pipe(gulp.dest(files.server[1]));
}

/* image */
function imageProject() {
  return gulp.src(files.image[0])
    .pipe(changed('dist'))
    .pipe(gulp.dest(files.image[1]));
}

/* watch */
function watch() {
  gulp.watch(path.join(__dirname, files.pug[0]), pugProject);
  gulp.watch(path.join(__dirname, files.sass[0]), gulp.series(sassProject, pugProject));
  gulp.watch(path.join(__dirname, files.js[0]), jsProject);
  gulp.watch(path.join(__dirname, files.server[0]), serverProject);
  gulp.watch(path.join(__dirname, files.image[0]), imageProject);
}

exports.default = gulp.series(
  gulp.parallel(
    gulp.series(sassProject, pugProject),
    jsProject,
    filesProject,
    serverProject,
    imageProject
  ),
  watch
);