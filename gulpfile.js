'use strict';

const { parallel, series, src, task } = require('gulp');

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
    () =>
    {
        const { createBaseConfig }  = require('@origin-1/eslint-config');
        const gulpESLintNew         = require('gulp-eslint-new');

        const baseConfig = createBaseConfig({ jsVersion: 2020, env: { node: true } });
        baseConfig.extends = 'plugin:eslint-plugin/all';
        const stream =
        src('{,{lib,test}/**/}*.js')
        .pipe(gulpESLintNew({ baseConfig, useEslintrc: false }))
        .pipe(gulpESLintNew.format());
        return stream;
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
