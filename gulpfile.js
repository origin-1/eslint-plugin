'use strict';

const { series, src, task } = require('gulp');

task
(
    'clean',
    async () =>
    {
        const { rm } = await import('node:fs/promises');

        await rm('coverage', { force: true, recursive: true });
    },
);

task
(
    'lint',
    async () =>
    {
        const
        [
            { finished },
            { createFlatConfig },
            { default: eslintPluginAll },
            { default: globals },
            { default: gulpESLintNew },
        ] =
        await Promise.all
        (
            [
                import('node:stream/promises'),
                import('@origin-1/eslint-config'),
                import('eslint-plugin-eslint-plugin/configs/all'),
                import('globals'),
                import('gulp-eslint-new'),
            ],
        );

        const baseConfig =
        await createFlatConfig
        (
            {
                jsVersion:          2020,
                languageOptions:    { globals: globals.node, sourceType: 'script' },
                rules:
                { 'eslint-plugin/require-meta-docs-description': ['error', { pattern: '.+' }] },
            },
        );
        baseConfig.unshift(eslintPluginAll);
        const stream =
        src('{,{lib,test}/**/}*.js')
        .pipe(gulpESLintNew({ configType: 'flat', baseConfig, overrideConfigFile: true }))
        .pipe(gulpESLintNew.format('compact'))
        .pipe(gulpESLintNew.failAfterError())
        .resume();
        await finished(stream);
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
                all:            true,
                reporter:       ['html', 'text-summary'],
                src:            'lib',
                useC8Config:    false,
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

task('default', series('clean', 'lint', 'test'));
