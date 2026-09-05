'use strict';

const rule              = require('../../../lib/rules/package-json-fields');
const RuleTester        = require('./rule-tester');
const { default: json } = require('@eslint/json');

const ruleTester = new RuleTester({ language: 'json/json', plugins: { json } });
const tests =
{
    valid:
    [
        '{ }',
        '{ "name": "some-package" }',
        '{ "name": "some-package", "version": "1.0.0" }',
        '{ "name": "some-package", "files": ["dist"], "imports": { }, "sideEffects": false }',
    ],
    invalid:
    [
        {
            code: '[]',
            errors:
            [
                {
                    messageId:  'expectedObject',
                    column:     1,
                    endColumn:  3,
                },
            ],
        },
        {
            code: 'null',
            errors:
            [
                {
                    messageId:  'expectedObject',
                    column:     1,
                    endColumn:  5,
                },
            ],
        },
        {
            code: '{ "version": "1.0.0", "name": "some-package" }',
            errors:
            [
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'version', prev: 'name' },
                    column:     3,
                    endColumn:  12,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'name', next: 'version' },
                    column:     23,
                    endColumn:  29,
                },
            ],
        },
        {
            code: '{ "description": "A package", "name": "some-package", "version": "1.0.0" }',
            errors:
            [
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'description', prev: 'version' },
                    column:     3,
                    endColumn:  16,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'version', next: 'description' },
                    column:     55,
                    endColumn:  64,
                },
            ],
        },
        {
            code: '{ "types": "index.d.ts", "sideEffects": false, "keywords": [], "imports": { } }',
            errors:
            [
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'types', prev: 'sideEffects' },
                    column:     3,
                    endColumn:  10,
                },
                {
                    messageId:  'expectedBetween',
                    data:       { field: 'sideEffects', prev: 'imports', next: 'types' },
                    column:     26,
                    endColumn:  39,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'imports', next: 'sideEffects' },
                    column:     64,
                    endColumn:  73,
                },
            ],
        },
        {
            code: '{ "imports": { }, "version": "1.0.0", "name": "some-package" }',
            errors:
            [
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'imports', prev: 'version' },
                    column:     3,
                    endColumn:  12,
                },
                {
                    messageId:  'expectedBetween',
                    data:       { field: 'version', prev: 'name', next: 'imports' },
                    column:     19,
                    endColumn:  28,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'name', next: 'version' },
                    column:     39,
                    endColumn:  45,
                },
            ],
        },
        {
            code:
            `
            {
                "name": "some-package",
                "version": "1.0.0",
                "exports": { },
                "files": ["dist"],
                "imports": { },
                "types": "index.d.ts"
            }
            `,
            errors:
            [
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'exports', prev: 'files' },
                    line:       5,
                    column:     17,
                    endLine:    5,
                    endColumn:  26,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'files', next: 'exports' },
                    line:       6,
                    column:     17,
                    endLine:    6,
                    endColumn:  24,
                },
            ],
        },
        {
            code: '{ "version": "1.0.0", "name": "some-package", "version": "2.0.0" }',
            errors:
            [
                {
                    messageId:  'uselessRedefined',
                    data:       { field: 'version' },
                    column:     3,
                    endColumn:  12,
                },
            ],
        },
        {
            code: '{ "name": "some-package", "version": "1.0.0", "name": "some-package" }',
            errors:
            [
                {
                    messageId:  'uselessRedefined',
                    data:       { field: 'name' },
                    column:     3,
                    endColumn:  9,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'name', next: 'version' },
                    column:     47,
                    endColumn:  53,
                },
            ],
        },
        {
            code: '{ "name": "some-package", "version": "1.0.0", "version": "2.0.0" }',
            errors:
            [
                {
                    messageId:  'uselessRedefined',
                    data:       { field: 'version' },
                    column:     27,
                    endColumn:  36,
                },
            ],
        },
        {
            code: '{ "version": "1.0.0", "version": "2.0.0", "name": "some-package" }',
            errors:
            [
                {
                    messageId:  'uselessRedefined',
                    data:       { field: 'version' },
                    column:     3,
                    endColumn:  12,
                },
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'version', prev: 'name' },
                    column:     23,
                    endColumn:  32,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'name', next: 'version' },
                    column:     43,
                    endColumn:  49,
                },
            ],
        },
        {
            code: '{ "imports": { }, "imports": { }, "exports": { } }',
            errors:
            [
                {
                    messageId:  'uselessRedefined',
                    data:       { field: 'imports' },
                    column:     3,
                    endColumn:  12,
                },
                {
                    messageId:  'expectedAfter',
                    data:       { field: 'imports', prev: 'exports' },
                    column:     19,
                    endColumn:  28,
                },
                {
                    messageId:  'expectedBefore',
                    data:       { field: 'exports', next: 'imports' },
                    column:     35,
                    endColumn:  44,
                },
            ],
        },
    ],
};

ruleTester.run('package-json-fields', rule, tests);
