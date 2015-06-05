var gulp         = require('gulp')

gulp.task('default', ['webpack:development', 'copy']);
// gulp.task('default', ['webpack:development', 'watch']);