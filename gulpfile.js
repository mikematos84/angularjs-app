const gulp = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const history = require('connect-history-api-fallback');

const scripts = require('./scripts');
const styles = require('./styles');

var devMode = false;

gulp.task('css', function(){
    return gulp.src(styles)
        .pipe(concat('main.css'))
        .pipe(sass({outputStyle: devMode === false ? 'compressed' : 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function(){
    return gulp.src(scripts)
        .pipe(concat('main.js'))
        .pipe(gulpif(devMode === false, uglify()))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function(){ 
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copy', function(){
    return gulp.src([
        './src/*.htaccess',
        './src/web.config',
        './src/*.xml',
        './src/*.png',
        './src/*.ico'
    ])
    .pipe(gulp.dest('./dist'));
})

gulp.task('build', function(){ 
    gulp.start(['css','js','html','copy'])
});

gulp.task('watch', function(){
    gulp.watch(['./src/scss/**/*.+(css|scss)'], ['css']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
})

gulp.task('browser-sync', function(){
    return browserSync.init(null, {
        open: false,
        server: {
            baseDir: './dist',
            middleware: [history()]
        }
    });
})

gulp.task('dev', function(){ 
    devMode = true;
    gulp.start(['build','browser-sync','watch']);
});

gulp.task('prod', function(){ 
    gulp.start(['build','browser-sync','watch']);
});