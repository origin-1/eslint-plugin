'use strict';

const rule =
require('../../../lib/rules/nice-space-before-function-paren');

const tsParser                          = require('@typescript-eslint/parser');
const { FlatRuleTester: RuleTester }    = require('eslint/use-at-your-own-risk');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        'function foo() {}',
        'function foo\n() {}',
        { code: 'function foo<T>() {}', languageOptions: { parser: tsParser } },
        { code: 'function foo<T>\n() {}', languageOptions: { parser: tsParser } },
        'function * foo() {}',
        'function * foo\n() {}',
        'async function foo() {}',
        'async function foo\n() {}',
        'var bar = function foo() {};',
        'var bar = function foo\n() {};',
        'var bar = function * foo() {};',
        'var bar = function * foo\n() {}',
        'var bar = async function foo() {};',
        'var bar = async function foo\n() {}',
        'var obj = { get foo() {}, set foo(val) {} };',
        'var obj = { get foo\n() {}, set foo\n(val) {} };',
        'var obj = { foo() {} };',
        'var obj = { foo\n() {} };',
        'class Foo { constructor() {} * method() {} }',

        'var foo = function () {};',
        { code: 'var foo = function <T>() {};', languageOptions: { parser: tsParser } },
        { code: 'var foo = function <T>\n() {};', languageOptions: { parser: tsParser } },
        'var foo = function * () {};',
        'var foo = async function () {};',

        'a => a',
        '() => 1',
        'async a => a',

        [
            'function foo \r () {}',
            'var bar = function () {};',
            'function * baz() {}',
            'var bat = function * () {};',
            'var obj = { get foo() {}, set foo(val) {}, bar() {} };',
        ]
        .join('\n'),
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
            code:               'function foo<T> () {}',
            languageOptions:    { parser: tsParser },
            output:             'function foo<T>() {}',
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
            code:   'function * foo () {}',
            output: 'function * foo() {}',
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
            code:   'async function foo () {}',
            output: 'async function foo() {}',
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
            code:   'var bar = function * foo () {};',
            output: 'var bar = function * foo() {};',
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
            code:   'var bar = async function foo () {};',
            output: 'var bar = async function foo() {};',
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
            code:   'var obj = { foo () {} };',
            output: 'var obj = { foo() {} };',
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
            code:   'class Foo { constructor () {} * method () {} }',
            output: 'class Foo { constructor() {} * method() {} }',
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
            code:               'var foo = function<T> () {};',
            languageOptions:    { parser: tsParser },
            output:             'var foo = function<T>() {};',
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
            code:   'var foo = function *() {};',
            output: 'var foo = function * () {};',
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
            code:   'var foo = async function() {};',
            output: 'var foo = async function () {};',
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
            code:   'async() => 1',
            output: 'async () => 1',
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
