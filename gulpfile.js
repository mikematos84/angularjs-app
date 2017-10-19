var gulp = require('gulp')
    , concat = require('gulp-concat')
    , gulpif = require('gulp-if')
    , uglify = require('gulp-uglify')
    , sass = require('gulp-sass')
    , jshint = require('gulp-jshint')
    , imagemin = require('gulp-imagemin')
    , autoprefixer = require('gulp-autoprefixer')
    , zip = require('gulp-zip')
    , merge = require('gulp-merge')
    , googleWebFonts = require('gulp-google-webfonts')
    , urlAdjuster = require('gulp-css-url-adjuster')
    , rename = require('gulp-rename');

var history = require('connect-history-api-fallback')
    , browserSync = require('browser-sync').create()
    , del = require('del')
    , runSequence = require('run-sequence').use(gulp)
    , argv = require('yargs').argv;

var package = require('./package')
    , scripts = require('./scripts')
    , styles = require('./styles');

var isProduction = (argv.production !== undefined) ? true : false,
    src = './src',
    dest = isProduction ? './dist' : './test';

var paths = {
    css: dest + '/css',
    js: dest + '/js',
    images: dest + '/img'
};

var version = '1.0.0';

gulp.task('sass', function () {
    return merge(
        gulp.src(styles),
        gulp.src([
            "./src/css/**/*.css",
            "./src/scss/**/*.scss",
            "./src/scss/**/_*.scss"
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
        .pipe(sass({
            outputStyle: isProduction ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {

    return merge(
        gulp.src(scripts),
        gulp.src([
            "./src/app/app.js",
            "./src/app/components/**/*.js",
            "./src/app/directives/**/*.js",
            "./src/app/services/**/*.js",
            "./src/app/factories/**/*.js"
        ])
            .pipe(jshint({ laxcomma: true }))
            .pipe(jshint.reporter('default'))

    )
        .pipe(concat('bundle.js'))
        .pipe(gulpif(isProduction,
            uglify({ mangle: false })
        ))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());
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
    return gulp.src('./node_modules/md-icons/**/*.+(eot|svg|ttf|woff|woff2|otf)')
        .pipe(gulp.dest(dest + '/css'))
});

gulp.task('fonts', function () {
    return gulp.src(src + '/fonts/**/*.+(eot|svg|ttf|woff|woff2|otf)')
        .pipe(gulp.dest(dest + '/fonts'))
})

gulp.task('assets', function () {
    return gulp.src([
        src + '/*.+(config|xml|png|ico)',
        src + '/.*+(htaccess)'
    ])
        .pipe(gulp.dest(dest));
});

gulp.task('html', function () {
    return gulp.src([src + '/**/*.html'])
        .pipe(gulp.dest(dest));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        open: false,
        server: {
            baseDir: dest,
            middleware: [
                history()
            ]
        }
    });
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch([src + '/**/*.+(css|scss)'], ['sass']);
    gulp.watch([src + '/**/*.js'], ['js']);
    gulp.watch([src + '/**/*.+(png|jpg|gif|svg)'], ['images']);
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
        'fonts',
        // 'md-icons',
        'images',
        'assets',
        'sass',
        'js',
        'html'
    ], function () {
        gulp.start('watch');
        console.log((isProduction) ? 'Production' : 'Development' + ' Build');
    });
});

gulp.task('default', ['build']);


/**
 * Google Web Fonts Preprosessing
 */
gulp.task('webfonts:1', function () {
    return gulp.src('./fonts.list')
        .pipe(googleWebFonts({
            fontsDir: 'fonts',
            cssDir: 'scss',
            cssFilename: '_fonts.scss'
        }))
        .pipe(gulp.dest(src))
})

gulp.task('webfonts:2', function () {
    return gulp.src(src + '/scss/_fonts.scss')
        .pipe(urlAdjuster({
            prepend: '../'
        }))
        .pipe(gulp.dest(src + '/scss'))
})

gulp.task('install-google-webfonts', function () {
    return runSequence('webfonts:1', function () {
        runSequence('webfonts:2', function () {
            console.log('Google Fonts Installed');
        })
    })
})

/**
 * Google Material Icons Preprosessing
 */

gulp.task('md-icons:1', function () {
    return gulp.src('./node_modules/md-icons/**/*.+(eot|svg|ttf|woff|woff2|otf)')
        .pipe(gulp.dest(src + '/fonts'))
});

gulp.task('md-icons:2', function () {
    return gulp.src('./node_modules/md-icons/**/*.+(css)')
        .pipe(rename('_material-icons.scss'))
        .pipe(gulp.dest(src + '/scss'))
});

gulp.task('md-icons:3', function () {
    return gulp.src(src + '/scss/_material-icons.scss')
        .pipe(urlAdjuster({
            prepend: '../fonts/'
        }))
        .pipe(gulp.dest(src + '/scss'))
})

gulp.task('install-google-md-icons', function () {
    return runSequence('md-icons:1', function () {
        runSequence('md-icons:2', function () {
            runSequence('md-icons:3', function () {
                console.log('Google Material Icons Installed')
            })
        })
    })
})

/**
 * Preprosessing
 */

 gulp.task('install', function(){
     runSequence([
         'install-google-webfonts',
         'install-google-md-icons'
    ], function(){
        console.log('Preprosessing Complete!');
    })
 })