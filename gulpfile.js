const gulp = require('gulp')
const pug = require('gulp-pug')
const scss = require('gulp-sass')
const plumber = require('gulp-plumber')
const del = require('del')
const server = require('browser-sync').create()

function pug2html () {
	return gulp
    .src('src/pages/*.pug')
    .pipe(plumber())
		.pipe(pug({
      pretty: true
    }))
		.pipe(gulp.dest('./build'))
}

function styles () {
  return gulp
    .src('src/pages/*.{scss, sass}')
    .pipe(plumber())
    .pipe(scss())
    .pipe(gulp.dest('./build'))
}

function copyjs () {
  return gulp
    .src('src/pages/script.js')
    .pipe(plumber())
    .pipe(gulp.dest('./build'))
}

function copyAssets () {
  return gulp
    .src('src/assets/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./build'))
}

function clean () {
  return del('./build')
}

function serve () {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true
  })
  gulp.watch(['src/pages/*.pug', 'src/pug/*.pug'], gulp.series(pug2html)).on('change', server.reload)
  gulp.watch(['src/pages/*.{scss, sass}', 'src/scss/*.{scss, sass}'], gulp.series(styles)).on('change', server.reload)
  gulp.watch('src/pages/*.js', gulp.series(copyjs)).on('change', server.reload)
  gulp.watch('src/assets/**/*', gulp.series(copyAssets)).on('change', server.reload)
}

exports.build = gulp.series(clean, gulp.parallel(pug2html, styles, copyjs, copyAssets))
exports.default = gulp.series(clean,gulp.parallel(pug2html, styles, copyjs, copyAssets), serve)
