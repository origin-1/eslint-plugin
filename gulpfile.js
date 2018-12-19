'use strict';

const { series, src, task } = require('gulp');

task
(
    'lint',
    () =>
    {
        const lint = require('gulp-fasttime-lint');

        const stream =
        lint
        (
            {
                src: ['**/*.js', '!coverage/**'],
                envs: ['node'],
                parserOptions: { ecmaVersion: 6 },
            }
        );
        return stream;
    }
);

task
(
    'test',
    () =>
    {
        const mocha = require('gulp-spawn-mocha');

        const stream = src('test/**/*.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

task('default', series('lint', 'test'));
