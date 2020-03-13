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
    scssPath: 'source/scss/**/*.scss',
    jsPath: 'source/js/**/*.js',
    htmlPath: 'dist/*.html'
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
    return src(['dist/index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.')
    );
}

// Watch task
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
    watch([files.scssPath, files.jsPath, files.htmlPath],
        parallel(scssTask, jsTask));
}

// Default Task
exports.default = series(
    parallel(scssTask, jsTask),
    cashBustTask,
    watchTask
)