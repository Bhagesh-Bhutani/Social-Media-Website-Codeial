// const gulp = require('gulp');

// const sass = require('gulp-sass')(require('sass'));
// const cssnano = require('gulp-cssnano');
// const rev = require('gulp-rev');
// const uglify = require('gulp-uglify-es').default;
// const jsonminify = require('gulp-jsonminify');
// // const imagemin = require('gulp-imagemin');
// const del = require('del');
import gulp from 'gulp';
import sassEngine from 'sass';
import sassGulp from 'gulp-sass'
import rev from 'gulp-rev';
import cssnano from 'gulp-cssnano';
import uglifyUtil from 'gulp-uglify-es';
import imagemin from 'gulp-imagemin';
import jsonminify from 'gulp-jsonminify';
import del from 'del';

const sass = sassGulp(sassEngine);
const uglify = uglifyUtil.default;

gulp.task('css', function(done){
    console.log('Minifying CSS...');
    gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        // base: './public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('js', function(done){
    console.log('Minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        // base: './public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('json',  function(done){
    console.log('Minifying JSON...');
    gulp.src('./assets/**/*.json')
    .pipe(jsonminify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        // base: './public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('images', function(done){
    console.log('Compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        // base: './public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'json', 'images'), function(done){
    console.log('Building assets');
    done();
});