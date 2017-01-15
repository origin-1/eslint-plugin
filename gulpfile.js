'use strict';

const gulp = require('gulp');

gulp.task(
    'lint',
    () =>
    {
        const lint = require('gulp-fasttime-lint');
        
        const src = ['**/*.js', '!coverage/**'];
        const options = { envs: ['node'], parserOptions: { ecmaVersion: 6 } };
        const stream = gulp.src(src).pipe(lint(options));
        return stream;
    }
);

gulp.task(
    'test',
    () =>
    {
        const mocha = require('gulp-spawn-mocha');
        
        const stream = gulp.src('test/**/*.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

gulp.task(
    'default',
    callback =>
    {
        const runSequence = require('run-sequence');
        
        runSequence('lint', 'test', callback);
    }
);
