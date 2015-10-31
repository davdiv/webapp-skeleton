'use strict';

let path = require('path');
let gulp = require('gulp');
let promisify = require('es6-promisify');
let rimraf = promisify(require('rimraf'));
let browserify = require('browserify');
let babel = require('gulp-babel');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
let gutil = require('gulp-util');
let merge = require('event-stream').merge;
let rename = require('gulp-rename');
let gzip = require('gulp-gzip');
let identity = require('gulp-identity');

let devMode = process.env.NODE_ENV === 'development';

if (devMode) {
    uglify = identity;
}

console.log(devMode ? 'Development mode' : 'Production mode');

gulp.task('clean', function() {
    return rimraf(path.join(__dirname, 'build'));
});

gulp.task('babel', function() {
    return gulp.src('./src/{client,server}/**/*.js')
        .pipe(babel({
            sourceMaps: 'inline',
            comments: devMode,
            compact: !devMode
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./build'));
});

gulp.task('statics-app', ['babel'], function() {
    return browserify({
        entries: 'build/client/init.js',
        debug: true
    })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/public/statics/'));
});

gulp.task('statics-deps', function() {
    return merge(
        gulp.src('node_modules/bootstrap/dist/{fonts,css}/**/*').pipe(rename(file => file.dirname = 'bootstrap/' + file.dirname))
    ).pipe(gulp.dest('build/public/statics'));
});

gulp.task('statics-gzip', ['src-processing', 'deps-processing'], function() {
    if (!devMode) {
        return gulp.src(['./build/public/statics/**/*', '!**/*.gz'])
            .pipe(gzip({
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('./build/public/statics'));
    }
});

gulp.task('src-processing', ['statics-app', 'babel']);
gulp.task('deps-processing', ['statics-deps']);
gulp.task('build', ['src-processing', 'deps-processing', 'statics-gzip']);

gulp.task('lint', function() {
    let eslint = require('gulp-eslint');
    return gulp.src(['src/**/*.js', '*.js', 'app'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', ['lint']);

if (devMode) {
    let runningProcess = null;
    gulp.task('dev-restart', ['src-processing', 'lint'], function() {
        if (runningProcess) {
            console.log('Closing app');
            runningProcess.kill();
        }
        console.log('Starting app');
        runningProcess = require('child_process').fork(path.join(__dirname, 'app'));
        runningProcess.disconnect();
    });

    gulp.task('dev', ['dev-restart'], function() {
        gulp.watch('src/**/*', ['dev-restart']);
    });
}
