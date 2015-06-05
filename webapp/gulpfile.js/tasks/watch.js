var gulp     = require('gulp');
var html     = require('../config/html');
var images   = require('../config/images');
var css     = require('../config/css');
var watch    = require('gulp-watch');

gulp.task('watch', function() {
  watch(images.src, function() { gulp.start('images'); });
  watch(css.src, function() { gulp.start('css'); });
  watch(html.watch, function() { gulp.start('html'); });
});
