'use strict';

const rule          = require('../../../lib/rules/update-expression-style');
const RuleTester    = require('./rule-tester');
const tsParser      = require('@typescript-eslint/parser');

const prefixError =
(operator, line, column) =>
(
    {
        message:    `Expected prefix operator "${operator}".`,
        line,
        column,
        endLine:    line,
        endColumn:  column + operator.length,
    }
);

const postfixError =
(operator, line, column) =>
(
    {
        message:    `Expected postfix operator "${operator}".`,
        line,
        column,
        endLine:    line,
        endColumn:  column + operator.length,
    }
);

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        // Default option is "postfix".
        'a++;',
        'a--;',
        'for (let i = 0; i < n; i++) ;',
        'for (i++; i < n; i++) ;',
        'a++, b++;',
        '(a++);',
        'if (x) a++; else b--;',
        'label: a++;',
        'do a++; while (x);',
        'a++\nb++',
        'void a++;',
        'x = void a++;',
        'void (a++, b++);',
        // Expressions whose value is used are ignored.
        'x = a++;',
        'x = ++a;',
        'f(++a);',
        'return_ = () => ++a;',
        '++a + b;',
        '-(++a);',
        'typeof ++a;',
        '!(++a);',
        'for (let i = 0; ++i < n;) ;',
        'while (++i) ;',
        'if (++i) ;',
        'x = (a++, ++b);',
        '[++a];',
        '`${++a}`;',
        { code: 'a++;', options: ['postfix'] },
        { code: 'x = ++a;', options: ['postfix'] },
        { code: '++a;', options: ['prefix'] },
        { code: '--a;', options: ['prefix'] },
        { code: 'for (let i = 0; i < n; ++i) ;', options: ['prefix'] },
        { code: 'for (++i; i < n; ++i) ;', options: ['prefix'] },
        { code: '++a, ++b;', options: ['prefix'] },
        { code: '(++a);', options: ['prefix'] },
        { code: 'if (x) ++a; else --b;', options: ['prefix'] },
        { code: 'label: ++a;', options: ['prefix'] },
        { code: 'do ++a; while (x);', options: ['prefix'] },
        { code: '++a\n++b', options: ['prefix'] },
        { code: 'void ++a;', options: ['prefix'] },
        { code: 'x = void ++a;', options: ['prefix'] },
        { code: 'void (++a, ++b);', options: ['prefix'] },
        { code: 'x = a++;', options: ['prefix'] },
        { code: 'a++ + b;', options: ['prefix'] },
        { code: 'a++\n+b;', options: ['prefix'] },
        { code: '-a++;', options: ['prefix'] },
        { code: 'typeof a++;', options: ['prefix'] },
        { code: '!a++;', options: ['prefix'] },
        { code: 'x = (++a, b++);', options: ['prefix'] },
        {
            code:               'a!++;',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'a++;',
            languageOptions:    { ecmaVersion: 5, sourceType: 'script' },
        },
        {
            code:               '++a!;',
            options:            ['prefix'],
            languageOptions:    { parser: tsParser },
        },
    ],
    invalid:
    [
        // Postfixes
        {
            code:       '++a;',
            errors:     [postfixError('++', 1, 1)],
            output:     'a++;',
        },
        {
            code:   '--a;',
            errors: [postfixError('--', 1, 1)],
            output: 'a--;',
        },
        {
            code:   '++a.b[c];',
            errors: [postfixError('++', 1, 1)],
            output: 'a.b[c]++;',
        },
        {
            code:   'for (let i = 0; i < n; ++i) ;',
            errors: [postfixError('++', 1, 24)],
            output: 'for (let i = 0; i < n; i++) ;',
        },
        {
            code:   'for (++i; i < n; ++i) ;',
            errors: [postfixError('++', 1, 6), postfixError('++', 1, 18)],
            output: 'for (i++; i < n; i++) ;',
        },
        {
            code:   '++a, ++b, x = ++c;',
            errors: [postfixError('++', 1, 1), postfixError('++', 1, 6)],
            output: 'a++, b++, x = ++c;',
        },
        {
            code:   'x = (++a, (++b, ++c));',
            errors: [postfixError('++', 1, 6), postfixError('++', 1, 12)],
            output: 'x = (a++, (b++, ++c));',
        },
        {
            code:   '(++a);',
            errors: [postfixError('++', 1, 2)],
            output: '(a++);',
        },
        {
            code:   '++(a);',
            errors: [postfixError('++', 1, 1)],
            output: '(a)++;',
        },
        {
            code:   'if (x) ++a; else --b;',
            errors: [postfixError('++', 1, 8), postfixError('--', 1, 18)],
            output: 'if (x) a++; else b--;',
        },
        {
            code:   'void ++a;',
            errors: [postfixError('++', 1, 6)],
            output: 'void a++;',
        },
        {
            code:   'x = void ++a;',
            errors: [postfixError('++', 1, 10)],
            output: 'x = void a++;',
        },
        {
            code:   'void\n++a;',
            errors: [postfixError('++', 2, 1)],
            output: 'void\na++;',
        },
        {
            code:   '++ a;',
            errors: [postfixError('++', 1, 1)],
            output: 'a++;',
        },
        {
            code:       '++a;',
            options:    ['postfix'],
            errors:     [postfixError('++', 1, 1)],
            output:     'a++;',
        },
        // Prefixes
        {
            code:       'a++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     '++a;',
        },
        {
            code:       'a--;',
            options:    ['prefix'],
            errors:     [prefixError('--', 1, 2)],
            output:     '--a;',
        },
        {
            code:       'a.b[c]++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 7)],
            output:     '++a.b[c];',
        },
        {
            code:       'for (let i = 0; i < n; i++) ;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 25)],
            output:     'for (let i = 0; i < n; ++i) ;',
        },
        {
            code:       'for (i++; i < n; i++) ;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 7), prefixError('++', 1, 19)],
            output:     'for (++i; i < n; ++i) ;',
        },
        {
            code:       'for (;; i++, j--) ;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 10), prefixError('--', 1, 15)],
            output:     'for (;; ++i, --j) ;',
        },
        {
            code:       'a++, b++, x = c++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2), prefixError('++', 1, 7)],
            output:     '++a, ++b, x = c++;',
        },
        {
            code:       '(a++, (b++, c++));',
            options:    ['prefix'],
            errors:
            [
                prefixError('++', 1, 3),
                prefixError('++', 1, 9),
                prefixError('++', 1, 14),
            ],
            output:     '(++a, (++b, ++c));',
        },
        {
            code:       'x = (a++, (b++, c++));',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 7), prefixError('++', 1, 13)],
            output:     'x = (++a, (++b, c++));',
        },
        {
            code:       '(a++);',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 3)],
            output:     '(++a);',
        },
        {
            code:       '(a)++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 4)],
            output:     '++(a);',
        },
        {
            code:       'if (x) a++; else b--;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 9), prefixError('--', 1, 19)],
            output:     'if (x) ++a; else --b;',
        },
        {
            code:       'label: a++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 9)],
            output:     'label: ++a;',
        },
        {
            code:       'do a++; while (x);',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 5)],
            output:     'do ++a; while (x);',
        },
        {
            code:       'a ++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 3)],
            output:     '++a;',
        },
        {
            code:       'void a++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 7)],
            output:     'void ++a;',
        },
        {
            code:       'x = void a++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 11)],
            output:     'x = void ++a;',
        },
        {
            code:       'void (a++, b++);',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 8), prefixError('++', 1, 13)],
            output:     'void (++a, ++b);',
        },
        {
            code:       'void a++\n(b)',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 7)],
            output:     null,
        },
        {
            code:       'a\t++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 3)],
            output:     '++a;',
        },
        {
            code:       'a++\nb++',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2), prefixError('++', 2, 2)],
            output:     '++a\n++b',
        },
        {
            code:       'x = y\na++',
            options:    ['prefix'],
            errors:     [prefixError('++', 2, 2)],
            output:     'x = y\n++a',
        },
        {
            code:       'a++\n{ }',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     '++a\n{ }',
        },
        {
            code:       '{ a++ }',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 4)],
            output:     '{ ++a }',
        },
        // A postfix operator cannot be preceded by a line break, so line breaks are removed.
        {
            code:   '++\na;',
            errors: [postfixError('++', 1, 1)],
            output: 'a++;',
        },
        {
            code:   '++\n\ta.b;',
            errors: [postfixError('++', 1, 1)],
            output: 'a.b++;',
        },
        {
            code:   '++a[\nb];',
            errors: [postfixError('++', 1, 1)],
            output: 'a[\nb]++;',
        },
        {
            code:   '++a\n++b',
            errors: [postfixError('++', 1, 1), postfixError('++', 2, 1)],
            output: 'a++\nb++',
        },
        {
            code:   'x = y\n++a',
            errors: [postfixError('++', 2, 1)],
            output: 'x = y\na++',
        },
        // Comments between the operator and the operand are not fixed.
        {
            code:   '++ /* comment */ a;',
            errors: [postfixError('++', 1, 1)],
            output: null,
        },
        {
            code:   '++ // comment\na;',
            errors: [postfixError('++', 1, 1)],
            output: null,
        },
        {
            code:   '++(/* comment */ a);',
            errors: [postfixError('++', 1, 1)],
            output: '(/* comment */ a)++;',
        },
        {
            code:   '/* comment */ ++a;',
            errors: [postfixError('++', 1, 15)],
            output: '/* comment */ a++;',
        },
        // Comments between the operand and the operator are not fixed.
        {
            code:       'a /* comment */ ++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 17)],
            output:     null,
        },
        {
            code:       '(a) /* comment */ ++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 19)],
            output:     null,
        },
        {
            code:       '(a /* comment */)++;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 18)],
            output:     '++(a /* comment */);',
        },
        {
            code:       'a++ /* comment */;',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     '++a /* comment */;',
        },
        // Fixes that would make a `(`, a `[` or a template literal attach to the operand are not
        // applied.
        {
            code:       'a++\n(b)',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     null,
        },
        {
            code:       'a++\n[b]',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     null,
        },
        {
            code:       'a++\n`b`',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     null,
        },
        {
            code:       'a++\n`b${c}d`',
            options:    ['prefix'],
            errors:     [prefixError('++', 1, 2)],
            output:     null,
        },
        // Prefixes with TypeScript-specific syntax
        {
            code:               'a!++;',
            options:            ['prefix'],
            errors:             [prefixError('++', 1, 3)],
            output:             '++a!;',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               '(a as number)++;',
            options:            ['prefix'],
            errors:             [prefixError('++', 1, 14)],
            output:             '++(a as number);',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               'a++;',
            options:            ['prefix'],
            errors:             [prefixError('++', 1, 2)],
            output:             '++a;',
            languageOptions:    { ecmaVersion: 5, sourceType: 'script' },
        },
        // Postfixes with TypeScript-specific syntax
        {
            code:               '++a!;',
            errors:             [postfixError('++', 1, 1)],
            output:             'a!++;',
            languageOptions:    { parser: tsParser },
        },
        {
            code:               '++(a as number);',
            errors:             [postfixError('++', 1, 1)],
            output:             '(a as number)++;',
            languageOptions:    { parser: tsParser },
        },
    ],
};

ruleTester.run('update-expression-style', rule, tests);
