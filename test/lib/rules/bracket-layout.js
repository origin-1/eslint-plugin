'use strict';

const rule                      = require('../../../lib/rules/bracket-layout');
const { default: patchTslib }   = require('@origin-1/eslint-config/patch-tslib');
const { RuleTester }            = require('eslint');

const ruleTester = new RuleTester();
patchTslib(require);
const tsParser = require.resolve('@typescript-eslint/parser');
const tests =
{
    valid:
    [
        '{\n}',
        'foo()',
        'foo(bar) + baz',
        'foo\n()',
        'foo\n(\nbar\n)',
        'new Foo(bar)',
        'new Foo\n(\nbar\n)',
        'new Foo',
        'new Foo + bar',
        '[foo](bar)',
        '[foo]\n(\nbar\n)',
        'foo() + bar',
        'foo\n(\nbar\n) + baz',
        'function foo() { }',
        'function foo(bar) { }',
        'void function () { }',
        'void function(bar) { }',
        'void function foo(bar) { }',
        {
            code:           'async => async',
            parserOptions:  { ecmaVersion: 2018 },
        },
        {
            code:           '; () => foo',
            parserOptions:  { ecmaVersion: 2015 },
        },
        {
            code:           'void { foo() { } }',
            parserOptions:  { ecmaVersion: 2015 },
        },
        {
            code:
            `
            void
            {
                foo
                (bar)
                { }
            }
            `,
            parserOptions: { ecmaVersion: 2015 },
        },
        'if (foo);',
        'if\n(\nfoo\n);',
        'while (foo);',
        'while\n(\nfoo\n);',
        'for (;;);',
        'for\n(\n;;\n);',
        'for (foo in bar);',
        'for\n(\nfoo in bar\n);',
        {
            code:           'for (foo of bar);',
            parserOptions:  { ecmaVersion: 2015 },
        },
        {
            code:           'for\n(\nfoo of bar\n);',
            parserOptions:  { ecmaVersion: 2015 },
        },
        'do; while (foo);',
        'do; while\n(\nfoo\n);',
        'with (foo);',
        'with\n(\nfoo\n);',
        {
            code:           'try { } catch { }',
            parserOptions:  { ecmaVersion: 2019 },
        },
        'try { } catch (foo) { }',
        `
        try { } catch
        (
            foo
        )
        { }
        `,
        'switch (foo) { }',
        `
        switch
        (
            foo
        )
        { }
        `,
        `
        function foo()
        {
            return (
                bar
            );
        }
        `,
        `
        throw {
            foo: bar,
        };
        `,
        {
            code:
            `
            function * foo()
            {
                yield [
                    bar
                ];
            }
            `,
            parserOptions: { ecmaVersion: 2015 },
        },
        {
            code:
            `
            [
                foo
            ] as const
            `,
            parser: tsParser,
        },
        {
            code:
            `
            [
                foo
            ] satisfies Bar
            `,
            parser: tsParser,
        },
        '!(\nfoo\n)',
        '++(\nfoo\n);',
        {
            code:
            `
            [
                ...[
                    foo
                ]
            ]
            `,
            parserOptions: { ecmaVersion: 2015 },
        },
        {
            code:
            `
            let foo:
            [
                ...[
                    bar
                ]
            ]
            `,
            parser: tsParser,
        },
        {
            code:
            `
            foo
            ?.[
                bar
            ]
            `,
            parserOptions: { ecmaVersion: 2020 },
        },
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
            parser: tsParser,
        },
        {
            code:
            [
                'type Foo = Bar[',
                '    0',
                '];',
            ]
            .join('\n'),
            parser: tsParser,
        },
        {
            code:
            [
                'type Foo =',
                '(',
                '    Bar | Baz',
                ')[];',
            ]
            .join('\n'),
            parser: tsParser,
        },
    ],
    invalid:
    [
        {
            code:   'foo(\n)',
            output: 'foo\n(\n)',
            errors: [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:   'foo(\n)',
            output: 'foo\n(\n)',
            errors: [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:   'foo\n(bar\n)',
            output: 'foo\n(\nbar\n)',
            errors: [{ messageId: 'sameLineAfterOpen', data: { bracket: '(' } }],
        },
        {
            code:   'foo\n(\nbar)',
            output: 'foo\n(\nbar\n)',
            errors: [{ messageId: 'sameLineBeforeClose', data: { bracket: ')' } }],
        },
        {
            code:   'foo([{ bar:\nbaz }])',
            output: 'foo\n(\n[\n{\n bar:\nbaz \n}\n]\n)',
            errors:
            [
                {
                    messageId:  'sameLineBeforeOpen',
                    data:       { bracket: '(' },
                    line:       1,
                    column:     4,
                    endLine:    1,
                    endColumn:  4,
                },
                {
                    messageId:  'sameLineBeforeOpen',
                    data:       { bracket: '[' },
                    line:       1,
                    column:     5,
                    endLine:    1,
                    endColumn:  5,
                },
                {
                    messageId:  'sameLineAfterOpen',
                    data:       { bracket: '(' },
                    line:       1,
                    column:     5,
                    endLine:    1,
                    endColumn:  5,
                },
                {
                    messageId:  'sameLineBeforeOpen',
                    data:       { bracket: '{' },
                    line:       1,
                    column:     6,
                    endLine:    1,
                    endColumn:  6,
                },
                {
                    messageId:  'sameLineAfterOpen',
                    data:       { bracket: '[' },
                    line:       1,
                    column:     6,
                    endLine:    1,
                    endColumn:  6,
                },
                {
                    messageId:  'sameLineAfterOpen',
                    data:       { bracket: '{' },
                    line:       1,
                    column:     7,
                    endLine:    1,
                    endColumn:  7,
                },
                {
                    messageId:  'sameLineBeforeClose',
                    data:       { bracket: '}' },
                    line:       2,
                    column:     5,
                    endLine:    2,
                    endColumn:  5,
                },
                {
                    messageId:  'sameLineAfterClose',
                    data:       { bracket: '}' },
                    line:       2,
                    column:     6,
                    endLine:    2,
                    endColumn:  6,
                },
                {
                    messageId:  'sameLineBeforeClose',
                    data:       { bracket: ']' },
                    line:       2,
                    column:     6,
                    endLine:    2,
                    endColumn:  6,
                },
                {
                    messageId:  'sameLineAfterClose',
                    data:       { bracket: ']' },
                    line:       2,
                    column:     7,
                    endLine:    2,
                    endColumn:  7,
                },
                {
                    messageId:  'sameLineBeforeClose',
                    data:       { bracket: ')' },
                    line:       2,
                    column:     7,
                    endLine:    2,
                    endColumn:  7,
                },
            ],
        },
        {
            code:   'new Foo(bar,\nbaz)',
            output: 'new Foo\n(\nbar,\nbaz\n)',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   '[foo](bar,\nbaz)',
            output: '[foo]\n(\nbar,\nbaz\n)',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'function foo(bar,\nbaz) { }',
            output: 'function foo\n(\nbar,\nbaz\n)\n { }',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:   'void function (foo,\nbar) { }',
            output: 'void function \n(\nfoo,\nbar\n)\n { }',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:   'void function async(bar,\nbaz) { }',
            output: 'void function async\n(\nbar,\nbaz\n)\n { }',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:           'void function * (bar,\nbaz) { }',
            output:         'void function * \n(\nbar,\nbaz\n)\n { }',
            parserOptions:  { ecmaVersion: 2018 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:           'void async function * (bar,\nbaz) { }',
            output:         'void async function * \n(\nbar,\nbaz\n)\n { }',
            parserOptions:  { ecmaVersion: 2018 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:           '; async (bar,\nbaz) => { }',
            output:         '; async (\nbar,\nbaz\n) => { }',
            parserOptions:  { ecmaVersion: 2018 },
            errors:
            [
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:
            `
            async(
                foo
            );
            `,
            output:
            `
            async\n(
                foo
            );
            `,
            errors: [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:           '; (foo,\nbar) => baz',
            output:         '; \n(\nfoo,\nbar\n) => baz',
            parserOptions:  { ecmaVersion: 2015 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:
            `
            void
            {
                async foo (bar,
                baz)
                { }
            }
            `,
            output:
            `
            void
            {
                async foo \n(\nbar,
                baz\n)
                { }
            }
            `,
            parserOptions: { ecmaVersion: 2018 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:
            `
            void
            {
                set foo (bar =
                baz)
                { }
            }
            `,
            output:
            `
            void
            {
                set foo \n(\nbar =
                baz\n)
                { }
            }
            `,
            parserOptions: { ecmaVersion: 2015 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'if (foo +\nbar);',
            output: 'if \n(\nfoo +\nbar\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:
            `
            if (foo) {
                bar();
            } else {
                baz();
            }
            `,
            output:
            `
            if (foo) \n{
                bar();
            }\n else \n{
                baz();
            }
            `,
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterClose' },
                { messageId: 'sameLineBeforeOpen' },
            ],
        },
        {
            code:   'while (foo +\nbar);',
            output: 'while \n(\nfoo +\nbar\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'for (;\n;);',
            output: 'for \n(\n;\n;\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'for (foo in\nbar);',
            output: 'for \n(\nfoo in\nbar\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:           'for (foo of\nbar);',
            output:         'for \n(\nfoo of\nbar\n);',
            parserOptions:  { ecmaVersion: 2015 },
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'do;\nwhile (foo +\nbar);',
            output: 'do;\nwhile \n(\nfoo +\nbar\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'do ((foo))\nwhile (foo +\nbar)',
            output: 'do ((foo))\nwhile \n(\nfoo +\nbar\n)',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'with (foo +\nbar);',
            output: 'with \n(\nfoo +\nbar\n);',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
            ],
        },
        {
            code:   'try { } catch (foo:\nany) { }',
            output: 'try { } catch \n(\nfoo:\nany\n)\n { }',
            parser: tsParser,
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:   'switch (foo +\nbar) { }',
            output: 'switch \n(\nfoo +\nbar\n)\n { }',
            errors:
            [
                { messageId: 'sameLineBeforeOpen' },
                { messageId: 'sameLineAfterOpen' },
                { messageId: 'sameLineBeforeClose' },
                { messageId: 'sameLineAfterClose' },
            ],
        },
        {
            code:
            `
            void
            {
                return(
                  foo
                )
                { }
            };
            `,
            output:
            `
            void
            {
                return\n(
                  foo
                )
                { }
            };
            `,
            parserOptions:  { ecmaVersion: 2015 },
            errors:         [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:
            `
            void
            {
                throw(
                  foo
                )
                { }
            };
            `,
            output:
            `
            void
            {
                throw\n(
                  foo
                )
                { }
            };
            `,
            parserOptions:  { ecmaVersion: 2015 },
            errors:         [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:
            `
            void
            {
                yield(
                  foo
                )
                { }
            };
            `,
            output:
            `
            void
            {
                yield\n(
                  foo
                )
                { }
            };
            `,
            parserOptions:  { ecmaVersion: 2015 },
            errors:         [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:   '(\nfoo\n).bar',
            output: '(\nfoo\n)\n.bar',
            errors: [{ messageId: 'sameLineAfterClose' }],
        },
        {
            code:           '(\nfoo\n)?.bar',
            output:         '(\nfoo\n)\n?.bar',
            parserOptions:  { ecmaVersion: 2020 },
            errors:         [{ messageId: 'sameLineAfterClose' }],
        },
        {
            code:   '{\n} as();',
            output: '{\n}\n as();',
            parser: tsParser,
            errors: [{ messageId: 'sameLineAfterClose', data: { bracket: '}' } }],
        },
        {
            code:   '{\n} satisfies();',
            output: '{\n}\n satisfies();',
            parser: tsParser,
            errors: [{ messageId: 'sameLineAfterClose', data: { bracket: '}' } }],
        },
        {
            code:   'foo > (\nbar\n)',
            output: 'foo > \n(\nbar\n)',
            parser: tsParser,
            errors: [{ messageId: 'sameLineBeforeOpen' }],
        },
    ],
};

ruleTester.run('bracket-layout', rule, tests);
