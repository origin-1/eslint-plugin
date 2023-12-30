'use strict';

const rule                              = require('../../../lib/rules/indent');
const tsParser                          = require('@typescript-eslint/parser');
const { FlatRuleTester: RuleTester }    = require('eslint/use-at-your-own-risk');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        '"ok"',
        '{\n    foo();\n}\nbar();',
        '{\n    foo();\n    /* comment */}\nbar();',
        '[1,\n2,\n3]',
        '{\n  \n}',
        [
            '/**',
            ' * FOO',
            ' */',
        ]
        .join('\n'),
        [
            'if (foo)',
            '    foo();',
            'else if (bar)',
            '    bar();',
            'else',
            '    baz();',
        ]
        .join('\n'),
        [
            'while (foo)',
            '    foo',
            '    (',
            '        bar',
            '    );',
        ]
        .join('\n'),
        [
            'for (;;) /*',
            ' FOO */ /*',
            ' BAR */',
            '    /* BAZ */',
            '    // FOOBAR',
            '    bar();',
        ]
        .join('\n'),
        [
            'switch (foo)',
            '{',
            '// BAR',
            'case 1 +',
            '2:',
            '    bar();',
            'default:',
            '}',
        ]
        .join('\n'),
        {
            code:
            [
                'type Foo',
                '<',
                '    T',
                '> =',
                'Bar<',
                '    T',
                '>;',
            ]
            .join('\n'),
            languageOptions: { parser: tsParser },
        },
        '     ',
        {
            code:
            [
                '(function () {',
                'for (;;) /*',
                ' FOO */ /*',
                ' BAR */',
                '    /* BAZ */',
                '    // FOOBAR',
                '    bar();',
                '}());',
            ]
            .join('\n'),
            options: [-1],
        },
    ],
    invalid:
    [
        {
            code:   ' "not ok"',
            output: '"not ok"',
            errors:
            [
                {
                    message:    'Expected indentation of 0 character(s) but found 1.',
                    line:       1,
                    column:     1,
                },
            ],
        },
        {
            code:   '(\n  \u2000"not ok"\n)',
            output: '(\n    "not ok"\n)',
            errors:
            [
                {
                    message:    'Expected indentation of 4 character(s) but found 3.',
                    line:       2,
                    column:     1,
                },
            ],
        },
        {
            code:
            [
                '(',
                '`',
                '(',
                '${',
                '(',
                'foo',
                ')',
                '}',
                ')',
                '`',
                ')',
            ]
            .join('\n'),
            output:
            [
                '(',
                '    `',
                '(',
                '${',
                '    (',
                '        foo',
                '    )',
                '    }',
                ')',
                '`',
                ')',
            ]
            .join('\n'),
            errors:
            [
                { messageId: 'indent' },
                { messageId: 'indent' },
                { messageId: 'indent' },
                { messageId: 'indent' },
                { messageId: 'indent' },
            ],
        },
        {
            code:
            [
                '  /**',
                '   * FOO',
                '   */',
            ]
            .join('\n'),
            output:
            [
                '/**',
                ' * FOO',
                ' */',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 2 },
                    line:       1,
                    column:     1,
                    endLine:    3,
                    endColumn:  6,
                },
            ],
        },
        {
            code:
            [
                '  /**',
                '   * FOO',
                '   */',
            ]
            .join('\n'),
            output:
            [
                '/**',
                ' * FOO',
                ' */',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 2 },
                    line:       1,
                    column:     1,
                    endLine:    3,
                    endColumn:  6,
                },
            ],
        },
        {
            code:
            [
                '  /**',
                ' * FOO',
                '   ',
                '* BAR',
                '   */',
            ]
            .join('\n'),
            output:
            [
                '/**',
                '* FOO',
                ' ',
                '* BAR',
                ' */',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 2 },
                    line:       1,
                    column:     1,
                    endLine:    5,
                    endColumn:  6,
                },
            ],
        },
        {
            code:
            [
                '{',
                '/* FOO',
                '   BAR */',
                '}',
            ]
            .join('\n'),
            output:
            [
                '{',
                '    /* FOO',
                '       BAR */',
                '}',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'indentBlockComment',
                    data:       { missing: 4 },
                    line:       2,
                    column:     1,
                    endLine:    3,
                    endColumn:  10,
                },
            ],
        },
        {
            code:
            [
                '   foo(); /* FOO',
                '             BAR */ /*',
                '             BAZ */',
            ]
            .join('\n'),
            output:
            [
                'foo(); /* FOO',
                '          BAR */ /*',
                '          BAZ */',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'indent',
                    data:       { actual: 3, expected: 0 },
                    line:       1,
                    column:     1,
                    endLine:    1,
                    endColumn:  4,
                },
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 3 },
                    line:       1,
                    column:     11,
                    endLine:    2,
                    endColumn:  20,
                },
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 3 },
                    line:       2,
                    column:     21,
                    endLine:    3,
                    endColumn:  20,
                },
            ],
        },
        {
            code:   'switch (foo) { case 1:\n  case 2: }',
            output: 'switch (foo) { case 1:\ncase 2: }',
            errors: [{ messageId: 'indent', data: { actual: 2, expected: 0 } }],
        },
        {
            code:       '   foo();',
            options:    [1],
            output:     '    foo();',
            errors:     [{ messageId: 'indent', data: { actual: 3, expected: 4 } }],
        },
        {
            code:       '     foo();',
            options:    [1],
            output:     '    foo();',
            errors:     [{ messageId: 'indent', data: { actual: 5, expected: 4 } }],
        },
        {
            code:       ' if (foo)\n bar();',
            options:    [-1],
            output:     'if (foo)\nbar();',
            errors:
            [
                { messageId: 'indent', data: { actual: 1, expected: 0 } },
                { messageId: 'indent', data: { actual: 1, expected: 0 } },
            ],
        },
        {
            code:
            [
                '/* FOO',
                '   BAR */',
                '     baz(); /*',
                '       FOO',
                '   BAR */',
            ]
            .join('\n'),
            options: [1],
            output:
            [
                '    /* FOO',
                '       BAR */',
                '    baz(); /*',
                '      FOO',
                '  BAR */',
            ]
            .join('\n'),
            errors:
            [
                {
                    messageId:  'indentBlockComment',
                    data:       { missing: 4 },
                    line:       1,
                    column:     1,
                    endLine:    2,
                    endColumn:  10,
                },
                {
                    messageId:  'indent',
                    data:       { actual: 5, expected: 4 },
                    line:       3,
                    column:     1,
                    endLine:    3,
                    endColumn:  6,
                },
                {
                    messageId:  'unindentBlockComment',
                    data:       { extra: 1 },
                    line:       3,
                    column:     13,
                    endLine:    5,
                    endColumn:  10,
                },
            ],
        },
    ],
};

ruleTester.run('indent', rule, tests);
