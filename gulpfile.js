import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import sync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import imageminMozjpeg from 'imagemin-svgo';
import webp from 'gulp-webp';
import fileinclude from 'gulp-file-include';
let uglify = require('gulp-uglify-es').default;
import babel from 'gulp-babel';
import ttfToWoff2 from "gulp-ttftowoff2";
import ttfToWoff from 'gulp-ttf-to-woff';

const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
  },
  source: {
    source: 'source/',
    html: 'source/blocks/*.html',
    js: 'source/js/script.js',
    sass: 'source/sass/style.scss',
    img: 'source/img/**/*.*',
    icons: 'source/img/icons/icon-*.svg',
    webp: 'source/img/**/*.{jpg,png}',
    fonts: 'source/fonts/**/*.ttf',
  },
  watch: {
    html: 'source/**/*.html',
    js: 'source/js/*.js',
    style: 'source/sass/**/*.scss',
    img: 'source/img/**/*.*',
    fonts: 'source/fonts/**/*.*',
  },
  clean: './build',
};

// HTML assembling
export const htmlBuild = () => {
  return gulp
    .src('source/index.html')
    .pipe(fileinclude({
      prefix: '@@',
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(sync.create().stream());
};

// Styles assembling
export const styles = () => {
  return gulp
    .src(path.source.sass)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('styles.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest(path.build.css))
    .pipe(sync.create().stream());
};

// JS assembling
export const scriptsBuild = () => {
  return gulp
    .src(path.source.js)
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(rename('main.min.js'))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(sync.create().stream());
};

// Server
export const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher
const watcher = () => {
  gulp.watch(path.watch.style, gulp.series('styles'));
  gulp.watch(path.watch.html, gulp.series('htmlBuild'));
  gulp.watch(path.watch.js, gulp.series('scriptsBuild'));
};

// Images optimization
export const images = () => {
  return gulp
    .src(path.source.img)
    .pipe(
      imagemin([
        imageminOptipng({ optimizationLevel: 3 }),
        imageminSvgo(),
        imageminMozjpeg({ quality: 75, progressive: true }),
      ])
    )
    .pipe(gulp.dest(path.build.img));
};

// Make Webp
export const makeWebp = () => {
  return gulp
    .src(path.source.webp)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(path.build.img));
};

// Sprite
export const sprite = () => {
  return gulp
    .src(path.source.icons)
    .pipe(svgstore({ inlineSvg: true }))
    /*.pipe(
      svgmin({
        plugins: [
          {
            name: 'removeViewBox',
            parmas: {
              active: false,
            },
          },
          {
            name: 'cleanupIDs',
            parmas: {
              active: false,
            },
          },
        ],
      })
    )*/
    .pipe(rename('sprite.min.svg'))
    .pipe(gulp.dest('build'));
};

// Fonts
export const fontsTtfToWoff = () => {
  return gulp
  .src(path.source.fonts)
  .pipe(ttfToWoff())
  .pipe(gulp.dest(path.build.fonts));
};

export const fontsTtfToWoff2 = () => {
  return gulp
  .src(path.source.fonts)
  .pipe(ttfToWoff2())
  .pipe(gulp.dest(path.build.fonts));
};

export default gulp.series(styles, server, watcher);
