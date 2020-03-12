// import npm pacakages and initialize modules
const { src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// File path variables
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
}

// Sass task
function scssTask() {
    return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist')
    );
}

// JS task
function jsTask() {
    return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist')
    )
    .pipe(browserSync.stream());
}

// Cachebusting task
const cbString = new Date().getTime();
function cashBustTask() {
    return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.')
    );
}

// Watch task
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    watch([files.scssPath, files.jsPath],
        parallel(scssTask, jsTask));
}

// Default Task
exports.default = series(
    parallel(scssTask, jsTask),
    cashBustTask,
    watchTask
)