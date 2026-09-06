'use strict';

const rule          = require('../../../lib/rules/no-spaces-in-unary-expression');
const RuleTester    = require('./rule-tester');
const tsParser      = require('@typescript-eslint/parser');

const spaceAfterError =
(operator, line, column, endColumn) =>
(
    {
        message:    `Unexpected space after operator "${operator}".`,
        line,
        column,
        endLine:    line,
        endColumn,
    }
);

const spaceBeforeError =
(operator, line, column, endColumn) =>
(
    {
        message:    `Unexpected space before operator "${operator}".`,
        line,
        column,
        endLine:    line,
        endColumn,
    }
);

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        '-a;',
        '+a;',
        '!a;',
        '~a;',
        '!!a;',
        '~~a;',
        '-(-a);',
        'a - -b;',
        '++a;',
        '--a;',
        'a++;',
        'a--;',
        'a-- - b;',
        'let x = -1;',
        'typeof a;',
        'typeof  a;',
        'void  a;',
        'delete  a.b;',
        'async function f() { await  a; }',
        'function * f() { yield  a; }',
        '[...a];',
        'f(...a);',
        '({ ...a });',
        'const [...a] = b;',
        'const { ...a } = b;',
        'function f(...a) { }',
        '-\na;',
        '-\n a;',
        '!\n(a);',
        '-\n-a;',
        'f(...\n[1, 2, 3].map(fn));',
        '-\u2028a;',
        '-\u2029a;',
        '- // comment\na;',
        '- /* comment */ a;',
        '-/* comment */a;',
        'a /* comment */ ++;',
        {
            code:               'type A = [...T];',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'function f(...args: string[]) { }',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'const a = b!.c;',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type B = { readonly [K in T]?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type C = { -readonly [K in T]-?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type D = { +readonly [K in T]+?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type E = [...\nT];',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type F = { -\nreadonly [K in T]: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type G = { [K in T]+? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type H = { [K in T]-? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type I = { [K in T]? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type J = { [K in T]\n+? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type L = { [K in T]\n? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type M = { [K in T]\n\t? };',
            languageOptions:    { parser: tsParser },
        },
    ],
    invalid:
    [
        {
            code:   '+ a;',
            errors: [spaceAfterError('+', 1, 2, 3)],
            output: '+a;',
        },
        {
            code:   '+ (\na);',
            errors: [spaceAfterError('+', 1, 2, 3)],
            output: '+(\na);',
        },
        {
            code:   '- a;',
            errors: [spaceAfterError('-', 1, 2, 3)],
            output: '-a;',
        },
        {
            code:   '! (a + b);',
            errors: [spaceAfterError('!', 1, 2, 3)],
            output: '!(a + b);',
        },
        {
            code:   '~   a;',
            errors: [spaceAfterError('~', 1, 2, 5)],
            output: '~a;',
        },
        {
            code:   'let x = - 1;',
            errors: [spaceAfterError('-', 1, 10, 11)],
            output: 'let x = -1;',
        },
        {
            code:   'a - - b;',
            errors: [spaceAfterError('-', 1, 6, 7)],
            output: 'a - -b;',
        },
        {
            code:   '++ a;',
            errors: [spaceAfterError('++', 1, 3, 4)],
            output: '++a;',
        },
        {
            code:   '-- a;',
            errors: [spaceAfterError('--', 1, 3, 4)],
            output: '--a;',
        },
        {
            code:   'a ++;',
            errors: [spaceBeforeError('++', 1, 2, 3)],
            output: 'a++;',
        },
        {
            code:   'a  --;',
            errors: [spaceBeforeError('--', 1, 2, 4)],
            output: 'a--;',
        },
        {
            code:   'a.b[c] ++;',
            errors: [spaceBeforeError('++', 1, 7, 8)],
            output: 'a.b[c]++;',
        },
        {
            code:   'f(... [1, 2, 3].map(fn));',
            errors: [spaceAfterError('...', 1, 6, 7)],
            output: 'f(...[1, 2, 3].map(fn));',
        },
        {
            code:   '[... a];',
            errors: [spaceAfterError('...', 1, 5, 6)],
            output: '[...a];',
        },
        {
            code:   '({ ... a });',
            errors: [spaceAfterError('...', 1, 7, 8)],
            output: '({ ...a });',
        },
        {
            code:   'const [... a] = b;',
            errors: [spaceAfterError('...', 1, 11, 12)],
            output: 'const [...a] = b;',
        },
        {
            code:   'const { ... a } = b;',
            errors: [spaceAfterError('...', 1, 12, 13)],
            output: 'const { ...a } = b;',
        },
        {
            code:   'function f(... a) { }',
            errors: [spaceAfterError('...', 1, 15, 16)],
            output: 'function f(...a) { }',
        },
        // Only the white space up to the end of the line is removed.
        {
            code:   'f(... \n[1, 2, 3]);',
            errors: [spaceAfterError('...', 1, 6, 7)],
            output: 'f(...\n[1, 2, 3]);',
        },
        {
            code:   '- \n-a;',
            errors: [spaceAfterError('-', 1, 2, 3)],
            output: '-\n-a;',
        },
        // Removing the white space would produce a different token.
        {
            code:   '- -a;',
            errors: [spaceAfterError('-', 1, 2, 3)],
            output: null,
        },
        {
            code:   '+ +a;',
            errors: [spaceAfterError('+', 1, 2, 3)],
            output: null,
        },
        {
            code:   '- --a;',
            errors: [spaceAfterError('-', 1, 2, 3)],
            output: null,
        },
        {
            code:   '- - a;',
            errors: [spaceAfterError('-', 1, 2, 3), spaceAfterError('-', 1, 4, 5)],
            output: '- -a;',
        },
        {
            code:   '~ ~ a;',
            errors: [spaceAfterError('~', 1, 2, 3), spaceAfterError('~', 1, 4, 5)],
            output: '~~a;',
        },
        {
            code:   'f(! a, ... b);',
            errors: [spaceAfterError('!', 1, 4, 5), spaceAfterError('...', 1, 11, 12)],
            output: 'f(!a, ...b);',
        },
        {
            code:               'type A = [... T];',
            errors:             [spaceAfterError('...', 1, 14, 15)],
            output:             'type A = [...T];',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'function f(... args: string[]) { }',
            errors:             [spaceAfterError('...', 1, 15, 16)],
            output:             'function f(...args: string[]) { }',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'const a = b !.c;',
            errors:             [spaceBeforeError('!', 1, 12, 13)],
            output:             'const a = b!.c;',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type B = { + readonly [K in T] + ?: V };',
            errors:
            [
                spaceAfterError('+', 1, 13, 14),
                spaceBeforeError('+', 1, 31, 32),
                spaceBeforeError('?', 1, 33, 34),
            ],
            output:             'type B = { +readonly [K in T]+?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type C = { - readonly [K in T] - ?: V };',
            errors:
            [
                spaceAfterError('-', 1, 13, 14),
                spaceBeforeError('-', 1, 31, 32),
                spaceBeforeError('?', 1, 33, 34),
            ],
            output:             'type C = { -readonly [K in T]-?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type D = { [K in T] - ? };',
            errors:
            [spaceBeforeError('-', 1, 20, 21), spaceBeforeError('?', 1, 22, 23)],
            output:             'type D = { [K in T]-? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type E = { [K in A extends B ? C : D] - ?: X };',
            errors:
            [spaceBeforeError('-', 1, 38, 39), spaceBeforeError('?', 1, 40, 41)],
            output:             'type E = { [K in A extends B ? C : D]-?: X };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type F = { [K in T]: - 1 };',
            errors:             [spaceAfterError('-', 1, 23, 24)],
            output:             'type F = { [K in T]: -1 };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type G = { [K in T] +? };',
            errors:             [spaceBeforeError('+', 1, 20, 21)],
            output:             'type G = { [K in T]+? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type H = { [K in T] ? };',
            errors:             [spaceBeforeError('?', 1, 20, 21)],
            output:             'type H = { [K in T]? };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type I = { [K in T]  ?: V };',
            errors:             [spaceBeforeError('?', 1, 20, 22)],
            output:             'type I = { [K in T]?: V };',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'type J = { [K in T] \n+? };',
            errors:             [spaceBeforeError('+', 1, 20, 21)],
            output:             'type J = { [K in T]\n+? };',
            languageOptions:    { parser: tsParser },
        },
    ],
};
ruleTester.run('no-spaces-in-unary-expression', rule, tests);
