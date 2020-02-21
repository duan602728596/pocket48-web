const gulp = require('gulp');
const terser = require('gulp-terser');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const postcssModules = require('postcss-modules');
const { files, babelNodeConfig, babelConfig, css, classNames } = require('./utils');

/* 拷贝pug文件 */
function pugProject() {
  return gulp.src(files.pug[0])
    .pipe(pug({
      locals: { css, classNames, timeStr: `?t=${ new Date().getTime() }` }
    }))
    .pipe(gulp.dest(files.pug[1]));
}

/* sass */
function sassProject() {
  return gulp.src(files.sass[0])
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([
      postcssModules({
        generateScopedName: '_[hash:base64:6]'
      })
    ]))
    .pipe(gulp.dest(files.sass[1]));
}

/* js */
function jsProject() {
  return gulp.src(files.js[0])
    .pipe(babel(babelConfig))
    .pipe(terser())
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
    .pipe(babel(babelNodeConfig))
    .pipe(gulp.dest(files.server[1]));
}

/* image */
function imageProject() {
  return gulp.src(files.image[0])
    .pipe(gulp.dest(files.image[1]));
}

exports.default = gulp.parallel(
  gulp.series(sassProject, pugProject),
  jsProject,
  filesProject,
  serverProject,
  imageProject
);