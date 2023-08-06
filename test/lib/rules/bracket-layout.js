'use strict';

const rule              = require('../../../lib/rules/bracket-layout');
const { RuleTester }    = require('eslint');

const ruleTester = new RuleTester();
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
        {
            code:           '(() => 42)();',
            parserOptions:  { ecmaVersion: 2015 },
        },
        {
            code:
            `
            ((
                foo,
                bar,
            ) => baz)();
            `,
            parserOptions: { ecmaVersion: 2017 },
        },
        {
            code:   '((foo: Foo): void => { })();',
            parser: tsParser,
        },
        `
        (function () {
            foo;
        })();
        `,
        `
        (function ()
        {
            foo;
        }
        )();
        `,
        `
        !function () {
        }();
        `,
        `
        (function () {
        }());
        `,
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
            parserOptions:  { ecmaVersion: 2018 },
            output:         'void function * \n(\nbar,\nbaz\n)\n { }',
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
            parserOptions:  { ecmaVersion: 2018 },
            output:         'void async function * \n(\nbar,\nbaz\n)\n { }',
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
            parserOptions:  { ecmaVersion: 2018 },
            output:         '; async (\nbar,\nbaz\n) => { }',
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
            parserOptions:  { ecmaVersion: 2015 },
            output:         '; \n(\nfoo,\nbar\n) => baz',
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
            parserOptions: { ecmaVersion: 2018 },
            output:
            `
            void
            {
                async foo \n(\nbar,
                baz\n)
                { }
            }
            `,
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
            parserOptions: { ecmaVersion: 2015 },
            output:
            `
            void
            {
                set foo \n(\nbar =
                baz\n)
                { }
            }
            `,
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
            parserOptions:  { ecmaVersion: 2015 },
            output:         'for \n(\nfoo of\nbar\n);',
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
            parser: tsParser,
            output: 'try { } catch \n(\nfoo:\nany\n)\n { }',
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
            parserOptions:  { ecmaVersion: 2015 },
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
            parserOptions:  { ecmaVersion: 2015 },
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
            parserOptions:  { ecmaVersion: 2015 },
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
            errors:         [{ messageId: 'sameLineBeforeOpen', data: { bracket: '(' } }],
        },
        {
            code:   '(\nfoo\n).bar',
            output: '(\nfoo\n)\n.bar',
            errors: [{ messageId: 'sameLineAfterClose' }],
        },
        {
            code:           '(\nfoo\n)?.bar',
            parserOptions:  { ecmaVersion: 2020 },
            output:         '(\nfoo\n)\n?.bar',
            errors:         [{ messageId: 'sameLineAfterClose' }],
        },
        {
            code:   '{\n} as();',
            parser: tsParser,
            output: '{\n}\n as();',
            errors: [{ messageId: 'sameLineAfterClose', data: { bracket: '}' } }],
        },
        {
            code:   '{\n} satisfies();',
            parser: tsParser,
            output: '{\n}\n satisfies();',
            errors: [{ messageId: 'sameLineAfterClose', data: { bracket: '}' } }],
        },
        {
            code:   'foo > (\nbar\n)',
            parser: tsParser,
            output: 'foo > \n(\nbar\n)',
            errors: [{ messageId: 'sameLineBeforeOpen' }],
        },
        {
            code:
            `
            (
            function () {
            })();
            `,
            output:
            `
            (
            function () \n{
            }\n)\n();
            `,
            errors:
            [
                { messageId: 'sameLineBeforeOpen', data: { bracket: '{' } },
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeClose', data: { bracket: ')' } },
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
            ],
        },
        {
            code:
            `
            (function () {
            }
            )();
            `,
            output:
            `
            (function () \n{
            }
            )();
            `,
            errors: [{ messageId: 'sameLineBeforeOpen', data: { bracket: '{' } }],
        },
        {
            code:
            `
            ((function () {
            }))();
            `,
            output:
            `
            (\n(\nfunction () \n{
            }\n)\n)\n();
            `,
            errors:
            [
                { messageId: 'sameLineBeforeOpen', data: { bracket: '(' } },
                { messageId: 'sameLineAfterOpen', data: { bracket: '(' } },
                { messageId: 'sameLineAfterOpen', data: { bracket: '(' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '{' } },
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeClose', data: { bracket: ')' } },
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
                { messageId: 'sameLineBeforeClose', data: { bracket: ')' } },
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
            ],
        },
        {
            code:
            `
            (function () {
            }) /* comment */ (
            );
            `,
            output:
            `
            (function () {
            })\n /* comment */ \n(
            );
            `,
            errors:
            [
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '(' } },
            ],
        },
        {
            code:
            `
            (() => [
                42
            ]\t)();
            `,
            parserOptions:  { ecmaVersion: 2015 },
            output:
            `
            (() => \n[
                42
            ]\t)();
            `,
            errors:         [{ messageId: 'sameLineBeforeOpen', data: { bracket: '[' } }],
        },
        {
            code:
            `
            (function () {
            }) /* comment */ (
            );
            `,
            output:
            `
            (function () {
            })\n /* comment */ \n(
            );
            `,
            errors:
            [
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '(' } },
            ],
        },
        {
            code:
            `
            !function () {
            } /* comment */ (
            );
            `,
            output:
            `
            !function () {
            }\n /* comment */ \n(
            );
            `,
            errors:
            [
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '(' } },
            ],
        },
        {
            code:
            `
            (function () {
            } /* comment */ (
            ));
            `,
            output:
            `
            (function () {
            }\n /* comment */ \n(
            ));
            `,
            errors:
            [
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '(' } },
            ],
        },
        {
            code:
            `
            (function () {
            })?.();
            `,
            parserOptions: { ecmaVersion: 2020 },
            output:
            `
            (\nfunction () \n{
            }\n)\n?.();
            `,
            errors:
            [
                { messageId: 'sameLineAfterOpen', data: { bracket: '(' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '{' } },
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeClose', data: { bracket: ')' } },
                { messageId: 'sameLineAfterClose', data: { bracket: ')' } },
            ],
        },
        {
            code:
            `
            !function () {
            }?.();
            `,
            parserOptions: { ecmaVersion: 2020 },
            output:
            `
            !function () \n{
            }\n?.();
            `,
            errors:
            [
                { messageId: 'sameLineBeforeOpen', data: { bracket: '{' } },
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
            ],
        },
        {
            code:
            `
            (function () {
            }?.());
            `,
            parserOptions: { ecmaVersion: 2020 },
            output:
            `
            (\nfunction () \n{
            }\n?.()\n);
            `,
            errors:
            [
                { messageId: 'sameLineAfterOpen', data: { bracket: '(' } },
                { messageId: 'sameLineBeforeOpen', data: { bracket: '{' } },
                { messageId: 'sameLineAfterClose', data: { bracket: '}' } },
                { messageId: 'sameLineBeforeClose', data: { bracket: ')' } },
            ],
        },
    ],
};

ruleTester.run('bracket-layout', rule, tests);
