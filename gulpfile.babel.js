import gulp from 'gulp'
import standard from 'gulp-standard'
import standardFormat from 'gulp-standard-format'

const filesToLint = [
  '*.js',
  '**/*.js',
  '!node_modules/**/*'
]

gulp.task('lint', () => {
  const stream = gulp.src(filesToLint)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
  // .pipe(flow())
  return stream
})

gulp.task('lint-fix', () => {
  const stream = gulp.src(filesToLint, { base: '.' })
    .pipe(standardFormat())
    .pipe(gulp.dest('.'))
  return stream
})
