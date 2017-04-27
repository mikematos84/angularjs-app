const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

const history = require('connect-history-api-fallback');
const merge = require('merge-stream');
const browserSync = require('browser-sync').create();
const del = require('del');

const scripts = require('./scripts');
const styles = require('./styles');

var devMode = false;
var paths = {
    get dest(){ return './dist'; },
    get css(){ return this.dest + '/css'; },
    get js(){ return this.dest + '/js'; },
    get images(){ return this.dest + '/images'; }
}

gulp.task('vendor', function(){
    return merge(
        gulp.src(styles)
            .pipe(concat('vendor.css'))
            .pipe(sass({outputStyle: devMode === false ? 'compressed' : 'expanded'}).on('error', sass.logError))
            .pipe(gulp.dest(paths.css)),
        gulp.src(scripts)
            .pipe(concat('vendor.js'))
            .pipe(gulpif(devMode === false, uglify({mangle:false})))
            .pipe(gulp.dest(paths.js))
    )
});

gulp.task('css', function(){
    return gulp.src(["./src/scss/**/*.scss"])
        .pipe(concat('main.css'))
        .pipe(sass({outputStyle: devMode === false ? 'compressed' : 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function(){
    return gulp.src(["./src/**/*.js"])
        .pipe(jshint({laxcomma: true}))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulpif(devMode === false, uglify({mangle:false})))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function(){ 
    return gulp.src('./src/**/*.html')
        .pipe(gulpif(devMode === false, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('images', function(){
    return gulp.src('./src/images/*')
        .pipe(gulpif(devMode === false, imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ], {verbose: true})))
        .pipe(gulp.dest(paths.images))
})

gulp.task('copy', function(){
    return gulp.src(['./src/*.+(config|xml|png|ico)','./src/.*+(htaccess)'])
    .pipe(gulp.dest(paths.dest));
})

gulp.task('clean', function(){
    return del(paths.dest);
})

gulp.task('build', ['clean'], function(){
    gulp.start(['vendor','css','js','html','images','copy','browser-sync','watch'], function(){
        console.log(' -------------------------------------');
        console.log(' Build Type: ' + (devMode === true ? 'DEV' : 'PROD'));
        console.log(' -------------------------------------');
        if(devMode === true){
            console.log(' * Least Efficient');
            console.log(' * Uncompressed files');
            console.log(' * Longer load times');
        }else{
            console.log(' * Most Efficient');
            console.log(' * Compressed files');
            console.log(' * Shorter load times');
        }
        console.log(' -------------------------------------');
    })
});

gulp.task('watch', function(){
    gulp.watch(['./src/**/*.+(css|scss)'], ['css']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
})

gulp.task('browser-sync', function(){
    return browserSync.init(null, {
        open: false,
        port: 2684,
        server: {
            baseDir: paths.dest,
            middleware: [history()]
        }
    });
})

gulp.task('default', function(){ 
    devMode = true;
    gulp.start(['build']);
});