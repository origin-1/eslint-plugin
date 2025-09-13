'use strict';

const rule          = require('../../../lib/rules/no-leading-binary-operator');
const RuleTester    = require('./rule-tester');
const tsParser      = require('@typescript-eslint/parser');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        // Binary operators.
        '1 + 2',
        '1 +\n2',
        '1n+\n2',
        '1+2',
        ' 1 + 2',
        '\n1 + 2',
        '1\n + \n2',
        'a && b',
        'a &&\nb',
        'a\n&&\nb',
        'a[0] = 1',
        'a[0] =\n1',
        'a[0]\n=\n1',

        // Ternary operators.
        'a ? 1 : 2',
        'a ?\n1 :\n2',
        'a\n?\n1\n:\n2',
        {
            code:               'type A = B extends C ? D : E',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type A = B extends C ?\nD :\nE',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type A = B extends C\n?\nD\n:\nE',
            languageOptions:    { parser: tsParser },
        },

        // `=` operators.
        '({ a = 1 }) => { }',
        '({ a =\n1 }) => { }',
        '({ a\n=\n1 }) => { }',
        'let a = 1, b =\n2, c\n=\n3, d',
        'class A { b = 1; c =\n2; d\n=\n3; e; }',
        {
            code:
            'class A { accessor b = 1; accessor c =\n2; accessor d\n=\n3; accessor e; }',
            languageOptions: { parser: tsParser },
        },
        {
            code:               'function foo<A = B, C =\nD, E\n=\nF, G>() { }',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'enum A { B = 1, C =\n2, D\n=\n3, E }',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'import a = b',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'import a =\nb',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'import a\n=\nb',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'export = a',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'export =\na',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'export\n=\na',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type A = B',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type A =\nB',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type A\n=\nB',
            languageOptions:    { parser: tsParser },
        },

        // Leading & is allowed in a type intersection.
        {
            code:               'type A =\n& B',
            languageOptions:    { parser: tsParser },
        },

        // Leading | is allowed in a type union.
        {
            code:               'type A =\n| B',
            languageOptions:    { parser: tsParser },
        },
    ],
    invalid:
    [
        // Various whitespace characters around the operator.
        {
            code:   '1\n\t -\v2',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '-' },
                    line:       2,
                    column:     3,
                    endColumn:  4,
                },
            ],
            output: '1\n\t -\n\t 2',
        },

        // Autofix only if there are no comments around the operator on the same line.
        {
            code:   '1\n/* comment */ * 2',
            errors: [{ messageId: 'leadingOperator' }],
        },
        {
            code:   'a // comment\n**= b',
            errors: [{ messageId: 'leadingOperator' }],
            output: 'a // comment\n**=\nb',
        },
        {
            code:   '1\n/ /* comment */ 2',
            errors: [{ messageId: 'leadingOperator' }],
        },
        {
            code:   '1\n** 2 + /* comment */ 3',
            errors: [{ messageId: 'leadingOperator' }],
            output: '1\n**\n2 + /* comment */ 3',
        },

        // Binary operators.
        {
            code:   '1\n+ 2',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '+' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output: '1\n+\n2',
        },
        {
            code:   'a\n|| b',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '||' },
                    line:       2,
                    column:     1,
                    endColumn:  3,
                },
            ],
            output: 'a\n||\nb',
        },
        {
            code:   'a[0]\n+= 1',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '+=' },
                    line:       2,
                    column:     1,
                    endColumn:  3,
                },
            ],
            output: 'a[0]\n+=\n1',
        },

        // Ternary operators.
        {
            code:   'a\n? 1\n: 2',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '?' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
                {
                    messageId:  'leadingOperator',
                    data:       { operator: ':' },
                    line:       3,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output: 'a\n?\n1\n:\n2',
        },
        {
            code:               'type A = B extends C\n? D\n: E',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '?' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
                {
                    messageId:  'leadingOperator',
                    data:       { operator: ':' },
                    line:       3,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'type A = B extends C\n?\nD\n:\nE',
        },

        // `=` operators.
        {
            code:   '({ a\n= 1 }) => { }',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output: '({ a\n=\n1 }) => { }',
        },
        {
            code:   'const a\n= 1',
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output: 'const a\n=\n1',
        },
        {
            code:               'class A { b\n= 1; }',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'class A { b\n=\n1; }',
        },
        {
            code:               'class A { accessor b\n= 1; }',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'class A { accessor b\n=\n1; }',
        },
        {
            code:               'function foo<A\n= B>() { }',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'function foo<A\n=\nB>() { }',
        },
        {
            code:               'enum A { B\n= 1 }',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'enum A { B\n=\n1 }',
        },
        {
            code:               'import a\n= require("foo")',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'import a\n=\nrequire("foo")',
        },
        {
            code:               'export\n= a',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'export\n=\na',
        },
        {
            code:               'type A\n= B',
            languageOptions:    { parser: tsParser },
            errors:
            [
                {
                    messageId:  'leadingOperator',
                    data:       { operator: '=' },
                    line:       2,
                    column:     1,
                    endColumn:  2,
                },
            ],
            output:             'type A\n=\nB',
        },
    ],
};
ruleTester.run('no-loading-binary-operator', rule, tests);
