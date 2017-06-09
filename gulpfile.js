var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    inject = require('gulp-inject'),
    htmlreplace = require('gulp-html-replace'),
    gzip = require('gulp-gzip')
gulpMerge = require('gulp-merge');

var history = require('connect-history-api-fallback'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    runSequence = require('run-sequence').use(gulp),
    argv = require('yargs').argv,
    es = require('event-stream');

var scripts = require('./scripts'),
    styles = require('./styles');

var isProduction = (argv.production !== undefined) ? true : false,
    src = './src',
    dest = isProduction ? './dist' : './test';

var paths = {
    css: dest + '/css',
    js: dest + '/js',
    images: dest + '/images'
}

gulp.task('vendor-styles', function () {
    var stream = gulp.src(styles)
        .pipe(concat('vendor.css'))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'ie 9'
            ],
            cascade: true
        }));

    if (isProduction === false) {
        stream
            .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
            .pipe(gulp.dest(paths.css));
    } else {
        stream
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(paths.css));
    }

    return stream;
})

gulp.task('vendor-scripts', function () {
    var stream = gulp.src(scripts)
        .pipe(concat('vendor.js'));

    if (isProduction) {
        stream
            .pipe(uglify({ mangle: false }));
    }

    stream
        .pipe(gulp.dest(dest + '/js'));

    return stream;
})

gulp.task('scss', function () {
    var stream = gulpMerge(
        gulp.src(styles),
        gulp.src(src + '/scss/**/*.scss')
    ).pipe(concat('styles.css'))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'ie 9'
            ],
            cascade: true
        }));

    if (isProduction === false) {
        stream
            .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
            .pipe(gulp.dest(paths.css));
    } else {
        stream
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(paths.css));
    }

    stream
        .pipe(browserSync.stream());

    return stream;
});

gulp.task('js', function () {
    var stream = gulpMerge(
        gulp.src(scripts),
        gulp.src([
            src + '/**/*.js',
            '!' + src + '/**/*.min.js'
        ])
            .pipe(jshint({ laxcomma: true }))
            .pipe(jshint.reporter('default'))
    ).pipe(jshint({ laxcomma: true }))
        .pipe(concat('bundle.js'));

    if (isProduction) {
        stream
            .pipe(uglify({ mangle: false }));
    }

    stream
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());

    return stream;
});

gulp.task('images', function () {
    var stream = gulp.src(src + '/img/**/*.+(png|jpg|gif|svg)');

    if (isProduction) {
        stream
            .pipe(gulpif(isProduction === false, imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 7 }),
                imagemin.svgo({ plugins: [{ removeViewBox: true }] })
            ], { verbose: true })));
    }

    stream
        .pipe(gulp.dest(paths.images));

    return stream;
})

gulp.task('md-icons', function () {
    var stream = gulp.src('./node_modules/md-icons/**/*.+(eot|svg|ttf|woff|woff2)')
        .pipe(gulp.dest(dest + '/css'));

    return stream;
});

gulp.task('assets', function () {
    var stream = gulp.src([
        src + '/*.+(config|xml|png|ico)',
        src + '/.*+(htaccess)'
    ]);

    stream
        .pipe(gulp.dest(dest));

    return stream;
})

gulp.task('html', function () {
    var stream = gulp.src([
        src + '/**/*.html'
    ]);

    stream
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());

    return stream;
});

gulp.task('watch', function () {
    browserSync.init({
        open: false,
        server: {
            baseDir: dest,
            middleware: [
                history()
            ]
        },
        watchOptions: {
            ignoreInitial: true
        }
    });

    gulp.watch([src + '/**/*.+(css|scss)'], ['scss']);
    gulp.watch([src + '/**/*.js'], ['js']);
    gulp.watch([src + '/**/*.html'], ['html']);
    gulp.watch([src + '/**/*.+(png|jpg|gif|svg)'], ['images']);
})

gulp.task('clean', function () {
    return del(dest);
})

gulp.task('build', ['clean'], function () {
    runSequence([
        'scss',
        'js',
        'images',
        'md-icons',
        'assets',
        'html'
    ], function () {
        gulp.start('watch');
        console.log((isProduction) ? 'Production' : 'Development' + ' Build');
    });
});

gulp.task('default', ['build']);