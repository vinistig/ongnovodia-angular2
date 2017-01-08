var gulp            = require('gulp'),
    del             = require('del'),
    merge           = require('merge-stream'),
    tsc             = require('gulp-typescript'),
    tsProject       = tsc.createProject('tsconfig.json'),
    SystemBuilder   = require('systemjs-builder'),
    jsMinify        = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    imagemin        = require('gulp-imagemin'),
    sass            = require('gulp-sass'),
    cssPrefixer     = require('gulp-autoprefixer'),
    cssMinify       = require('gulp-cssnano'),
    postcss         = require('gulp-postcss'),
    svgStore        = require('gulp-svgstore'),
    inject          = require('gulp-inject'),
    svgMin          = require('gulp-svgmin');

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('shims', () => {
    return gulp.src([
            'node_modules/core-js/client/shim.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js'
        ])
        .pipe(concat('shims.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('system-build', [ 'tsc' ], () => {
    var builder = new SystemBuilder();

    return builder.loadConfig('system.config.js')
        .then(() => builder.buildStatic('app', 'dist/js/bundle.js'))
        .then(() => del('build'));
});

gulp.task('tsc', () => {
    del('build');

    return gulp.src('src/app/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('build/'));
});

gulp.task('html', () => {
    return gulp.src('src/**/**.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('postcss', function() {
    var processors = [
        require('postcss-import')(),
        require('postcss-cssnext')(),
        require('postcss-reporter')()
    ];

    return gulp
        .src('./src/css/style.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('icons-svg', () => {
    return gulp
        .src('./src/images/*.svg')
        .pipe(svgStore())
        .pipe(gulp.dest('./dist/images/'))
});

gulp.task('inject-icons', ['icons-svg'], function () {
    var svgs = gulp
        .src('dist/images/images.svg')
        .pipe(svgStore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./dist/index.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
    var watchTs = gulp.watch('src/app/**/**.ts', [ 'default' ]),
        watchScss = gulp.watch('src/css/**/*.css', [ 'postcss' ]),
        watchHtml = gulp.watch('src/**/*.html', [ 'html', 'inject-icons' ]),
        watchImages = gulp.watch('src/images/**/*.*', [ 'icons-svg', 'inject-icons' ]),

        onChanged = function(event) {
            console.log('File ' + event.path + ' was ' + event.type + '. Running tasks...');
        };

    watchTs.on('change', onChanged);
    watchScss.on('change', onChanged);
    watchHtml.on('change', onChanged);
    watchImages.on('change', onChanged);
});

gulp.task('default', [
    'shims',
    'system-build',
    'html',
    'postcss',
    'icons-svg',
    'inject-icons'
]);
