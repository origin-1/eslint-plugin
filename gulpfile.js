'use strict';

const { series, task } = require('gulp');

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
                src: ['**/*.js', '!coverage/**', '!node_modules/**'],
                envs: 'node',
                parserOptions: { ecmaVersion: 8 },
            },
        );
        return stream;
    },
);

task
(
    'test',
    callback =>
    {
        const { fork } = require('child_process');

        const { resolve } = require;
        const nycPath = resolve('nyc/bin/nyc');
        const mochaPath = resolve('mocha/bin/mocha');
        const childProcess =
        fork
        (nycPath, ['--reporter=html', '--reporter=text-summary', '--', mochaPath, 'test/**/*.js']);
        childProcess.on('exit', code => callback(code && 'Test failed'));
    },
);

task('default', series('lint', 'test'));
