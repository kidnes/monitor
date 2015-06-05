var config       = require('../config/copy');
var gulp         = require('gulp');

gulp.task('copy', function() {
    return gulp.src(config.src, { "base" : config.root })
        .pipe(gulp.dest(config.dest));
});