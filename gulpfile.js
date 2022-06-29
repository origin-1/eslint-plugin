'use strict';

const { parallel, series, task } = require('gulp');

task
(
    'clean',
    async () =>
    {
        const { rm } = require('fs/promises');

        await rm('coverage', { force: true, recursive: true });
    },
);

task
(
    'lint',
    async () =>
    {
        const { lint } = require('@fasttime/lint');

        await
        lint
        ({ src: '{,{lib,test}/**/}*.js', envs: ['node'], parserOptions: { ecmaVersion: 2020 } });
    },
);

task
(
    'test',
    async () =>
    {
        const { default: c8js } = await import('c8js');

        const mochaPath = require.resolve('mocha/bin/mocha');
        await c8js
        (
            mochaPath,
            ['--check-leaks', 'test/**/*.js'],
            {
                all: true,
                reporter: ['html', 'text-summary'],
                src: 'lib',
                useC8Config: false,
                watermarks:
                {
                    branches:   [90, 100],
                    functions:  [90, 100],
                    lines:      [90, 100],
                    statements: [90, 100],
                },
            },
        );
    },
);

task('default', series(parallel('clean', 'lint'), 'test'));
