var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename');

var history = require('connect-history-api-fallback'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    runSequence = require('run-sequence');

var scripts = require('./scripts'),
    styles = require('./styles');

var devMode = false,
    src = './src'
    paths = {
        get dest(){ return devMode ? './test' : './dist'; },
        get css(){ return this.dest + '/css'; },
        get js(){ return this.dest + '/js'; },
        get images(){ return this.dest + '/img'; }
    };

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

gulp.task('scss', function(){
    return gulp.src('./src/scss/**/*.scss')
        .pipe(concat('main.css'))
        .pipe(sass({outputStyle: devMode === false ? 'compressed' : 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(){
    return gulp.src('./src/**/*.js')
        .pipe(jshint({laxcomma: true}))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulpif(devMode === false, uglify({mangle:false})))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function(){ 
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function(){
    return gulp.src('./src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(gulpif(devMode === false, imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ], {verbose: true})))
        .pipe(gulp.dest(paths.images))
})

gulp.task('copy', function(){
    return gulp.src([
        './src/*.+(config|xml|png|ico)',
        './src/.*+(htaccess)'
    ])
    .pipe(gulp.dest(paths.dest));
})

gulp.task('clean', function(){
    return del(paths.dest);
})

gulp.task('watch', function(){
    gulp.watch(['./src/**/*.+(css|scss)'], ['css']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
    gulp.watch(['./src/**/*.+(png|jpg|gif|svg)'], ['images'])
})

gulp.task('browser-sync', function(){
    return browserSync.init({
        open: false,
        server: {baseDir: paths.dest, middleware: [history()]}
    });
})

gulp.task('build', ['clean'], function(){
    runSequence(['vendor','scss','js','html','images','copy','watch'], function(){ 
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
        gulp.start('browser-sync');
    });
});

gulp.task('default', function(){ 
    devMode = true;
    gulp.start(['build']);
});