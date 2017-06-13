var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    zip = require('gulp-zip'),
    gulpMerge = require('gulp-merge');

var history = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    runSequence = require('run-sequence').use(gulp),
    argv = require('yargs').argv;

var package = require('./package'),
    scripts = require('./scripts'),
    styles = require('./styles');

var isProduction = (argv.production !== undefined) ? true : false,
    src = './src',
    dest = isProduction ? './dist' : './test';

var paths = {
    css: dest + '/css',
    js: dest + '/js',
    images: dest + '/img'
};

var version = '1.0.0';

gulp.task('scss', function () {
    return gulpMerge(
        gulp.src(styles),
        gulp.src([
            "./src/css/**/*.css",
            "./src/scss/**/*.scss"
        ])
    )
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'ie 9'
            ],
            cascade: true
        }))
        .pipe(concat('styles.css'))
        .pipe(sass({ outputStyle: isProduction ? 'compressed' : 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ match: paths.css + '/**/*.css' }));
});

gulp.task('js', function () {

    return gulpMerge(
        gulp.src(scripts),
        gulp.src([
            "./src/app/app.js",
            "./src/app/components/**/*.js",
            "./src/app/directives/**/*.js"
        ])
            .pipe(jshint({ laxcomma: true }))
            .pipe(jshint.reporter('default'))

    )
        .pipe(concat('bundle.js'))
        .pipe(gulpif(isProduction,
            uglify({ mangle: false })
        ))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream({ match: paths.js + '/**/*.js' }));
});

gulp.task('images', function () {
    var stream = gulp.src(src + '/img/**/*.+(png|jpg|gif|svg)')
        .pipe(gulpif(isProduction, imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 9 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ], { verbose: true })))
        .pipe(gulp.dest(paths.images));
});

gulp.task('md-icons', function () {
    return gulp.src('./node_modules/md-icons/**/*.+(eot|svg|ttf|woff|woff2)')
        .pipe(gulp.dest(dest + '/css'))
});

gulp.task('assets', function () {
    return gulp.src([
        src + '/*.+(config|xml|png|ico)',
        src + '/.*+(htaccess)'
    ])
        .pipe(gulp.dest(dest));
});

gulp.task('html', function () {
    return gulp.src([src + '/**/*.html'])
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function () {
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
})

gulp.task('watch', function () {
    gulp.watch([src + '/**/*.+(css|scss)'], ['scss']).on('change', browserSync.reload);
    gulp.watch([src + '/**/*.js'], ['js']).on('change', browserSync.reload);
    gulp.watch([src + '/**/*.+(png|jpg|gif|svg)'], ['images']).on('change', browserSync.reload);
    gulp.watch([src + '/**/*.html'], ['html']).on('change', browserSync.reload);
});

gulp.task('clean', function () {
    return del(dest);
});

gulp.task('package', function () {
    var file = package.name + '-v' + package.version + '.zip';
    return gulp.src([
        dest + '/**/*',
        '!' + dest + '/**/*.zip'
    ])
        .pipe(zip(file))
        .pipe(gulp.dest(dest)).on('end', function () {
            console.log('Package created: ' + dest + '/' + file);
        });
})

gulp.task('build', ['clean'], function () {
    runSequence([
        'scss',
        'js',
        'images',
        'md-icons',
        'assets',
        'html',
        'browser-sync'
    ], function () {
        gulp.start('watch');
        console.log((isProduction) ? 'Production' : 'Development' + ' Build');
    });
});

gulp.task('default', ['build']);