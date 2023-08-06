'use strict';

const rule              = require('../../../lib/rules/nice-space-before-function-paren');
const { RuleTester }    = require('eslint');

const ruleTester = new RuleTester();
const tsParser = require.resolve('@typescript-eslint/parser');
const tests =
{
    valid:
    [
        'function foo() {}',
        'function foo\n() {}',
        { code: 'function foo<T>() {}', parser: tsParser },
        { code: 'function foo<T>\n() {}', parser: tsParser },
        { code: 'function * foo() {}', parserOptions: { ecmaVersion: 6 } },
        { code: 'function * foo\n() {}', parserOptions: { ecmaVersion: 6 } },
        { code: 'async function foo() {}', parserOptions: { ecmaVersion: 8 } },
        { code: 'async function foo\n() {}', parserOptions: { ecmaVersion: 8 } },
        'var bar = function foo() {};',
        'var bar = function foo\n() {};',
        { code: 'var bar = function * foo() {};', parserOptions: { ecmaVersion: 6 } },
        { code: 'var bar = function * foo\n() {}', parserOptions: { ecmaVersion: 6 } },
        { code: 'var bar = async function foo() {};', parserOptions: { ecmaVersion: 8 } },
        { code: 'var bar = async function foo\n() {}', parserOptions: { ecmaVersion: 8 } },
        'var obj = { get foo() {}, set foo(val) {} };',
        'var obj = { get foo\n() {}, set foo\n(val) {} };',
        { code: 'var obj = { foo() {} };', parserOptions: { ecmaVersion: 6 } },
        { code: 'var obj = { foo\n() {} };', parserOptions: { ecmaVersion: 6 } },
        { code: 'class Foo { constructor() {} * method() {} }', parserOptions: { ecmaVersion: 6 } },

        'var foo = function () {};',
        { code: 'var foo = function <T>() {};', parser: tsParser },
        { code: 'var foo = function <T>\n() {};', parser: tsParser },
        { code: 'var foo = function * () {};', parserOptions: { ecmaVersion: 6 } },
        { code: 'var foo = async function () {};', parserOptions: { ecmaVersion: 8 } },

        { code: 'a => a', parserOptions: { ecmaVersion: 6 } },
        { code: '() => 1', parserOptions: { ecmaVersion: 6 } },
        { code: 'async a => a', parserOptions: { ecmaVersion: 8 } },

        {
            code:
            [
                'function foo \r () {}',
                'var bar = function () {};',
                'function * baz() {}',
                'var bat = function * () {};',
                'var obj = { get foo() {}, set foo(val) {}, bar() {} };',
            ]
            .join('\n'),
            parserOptions: { ecmaVersion: 6 },
        },
    ],

    invalid:
    [
        {
            code:   'function foo () {}',
            output: 'function foo() {}',
            errors:
            [
                {
                    type:       'FunctionDeclaration',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     13,
                },
            ],
        },
        {
            code:   'function foo<T> () {}',
            parser: tsParser,
            output: 'function foo<T>() {}',
            errors:
            [
                {
                    type:       'FunctionDeclaration',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     16,
                },
            ],
        },
        {
            code:           'function * foo () {}',
            parserOptions:  { ecmaVersion: 6 },
            output:         'function * foo() {}',
            errors:
            [
                {
                    type:       'FunctionDeclaration',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     15,
                },
            ],
        },
        {
            code:           'async function foo () {}',
            parserOptions:  { ecmaVersion: 8 },
            output:         'async function foo() {}',
            errors:
            [
                {
                    type:       'FunctionDeclaration',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     19,
                },
            ],
        },
        {
            code:   'var bar = function foo () {};',
            output: 'var bar = function foo() {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     23,
                },
            ],
        },
        {
            code:           'var bar = function * foo () {};',
            parserOptions:  { ecmaVersion: 6 },
            output:         'var bar = function * foo() {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     25,
                },
            ],
        },
        {
            code:           'var bar = async function foo () {};',
            parserOptions:  { ecmaVersion: 8 },
            output:         'var bar = async function foo() {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     29,
                },
            ],
        },
        {
            code:   'var obj = { get foo () {}, set foo (val) {} };',
            output: 'var obj = { get foo() {}, set foo(val) {} };',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     20,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     35,
                },
            ],
        },
        {
            code:           'var obj = { foo () {} };',
            parserOptions:  { ecmaVersion: 6 },
            output:         'var obj = { foo() {} };',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     16,
                },
            ],
        },
        {
            code:           'class Foo { constructor () {} * method () {} }',
            parserOptions:  { ecmaVersion: 6 },
            output:         'class Foo { constructor() {} * method() {} }',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     24,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     39,
                },
            ],
        },

        {
            code:   'var foo = function() {};',
            output: 'var foo = function () {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Missing space before function parentheses.',
                    line:       1,
                    column:     19,
                },
            ],
        },
        {
            code:   'var foo = function<T> () {};',
            parser: tsParser,
            output: 'var foo = function<T>() {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     22,
                },
            ],
        },
        {
            code:           'var foo = function *() {};',
            parserOptions:  { ecmaVersion: 6 },
            output:         'var foo = function * () {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Missing space before function parentheses.',
                    line:       1,
                    column:     21,
                },
            ],
        },
        {
            code:           'var foo = async function() {};',
            parserOptions:  { ecmaVersion: 8 },
            output:         'var foo = async function () {};',
            errors:
            [
                {
                    type:       'FunctionExpression',
                    message:    'Missing space before function parentheses.',
                    line:       1,
                    column:     25,
                },
            ],
        },

        {
            code:           'async() => 1',
            parserOptions:  { ecmaVersion: 8 },
            output:         'async () => 1',
            errors:
            [
                {
                    message:    'Missing space before function parentheses.',
                    type:       'ArrowFunctionExpression',
                },
            ],
        },

        {
            code:
            [
                'function foo () {}',
                'var bar = function() {};',
                'var obj = { get foo () {}, set foo (val) {}, bar () {} };',
            ]
            .join('\n'),
            parserOptions: { ecmaVersion: 6 },
            output:
            [
                'function foo() {}',
                'var bar = function () {};',
                'var obj = { get foo() {}, set foo(val) {}, bar() {} };',
            ]
            .join('\n'),
            errors:
            [
                {
                    type:       'FunctionDeclaration',
                    message:    'Unexpected space before function parentheses.',
                    line:       1,
                    column:     13,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Missing space before function parentheses.',
                    line:       2,
                    column:     19,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       3,
                    column:     20,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       3,
                    column:     35,
                },
                {
                    type:       'FunctionExpression',
                    message:    'Unexpected space before function parentheses.',
                    line:       3,
                    column:     49,
                },
            ],
        },
    ],
};
ruleTester.run('nice-space-before-function-paren', rule, tests);
