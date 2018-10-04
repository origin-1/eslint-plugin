'use strict';

const gulp = require('gulp');

gulp.task
(
    'lint',
    () =>
    {
        const lint = require('gulp-fasttime-lint');

        const stream =
        gulp
        .src(['**/*.js', '!coverage/**'])
        .pipe(lint({ envs: ['node'], parserOptions: { ecmaVersion: 6 } }));
        return stream;
    }
);

gulp.task
(
    'test',
    () =>
    {
        const mocha = require('gulp-spawn-mocha');

        const stream = gulp.src('test/**/*.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

gulp.task
(
    'default',
    callback =>
    {
        const runSequence = require('run-sequence');

        runSequence('lint', 'test', callback);
    }
);
