'use strict';

const rule          = require('../../../lib/rules/multiline-node-layout');
const RuleTester    = require('./rule-tester');
const tsParser      = require('@typescript-eslint/parser');

const ruleTester = new RuleTester();

const tests =
{
    valid:
    [
        'a = b, c;',
        'a = b,\nc;',
        '({ a: b,\nc });',
        `
        test(
            a, b,
        );
        `,
        `
        [
            foo =
            bar,
        ];
        `,
        'a = b; c = d;',
        'a +\nb;',
        `
        const foo =
        {
            bar: baz,
        };
        `,
        `
        if (foo)
            bar; baz;
        `,
        `
        (foo,
        bar) => baz;
        `,
        {
            code:
            `
            type Foo =
            Promise<
            unknown>;
            `,
            languageOptions: { parser: tsParser },
        },
    ],
    invalid:
    [
        {
            code:
            `
            test(a, b +
            c);
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            test(a,\n b +
            c);
            `,
        },
        {
            code:
            `
            function test(a, { b:
            c }) { }
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            function test(a,\n { b:
            c }) { }
            `,
        },
        {
            code:
            `
            (function(
                [
                    a,
                    b,
                ], c
            ) { })();
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ',' } }],
            output:
            `
            (function(
                [
                    a,
                    b,
                ],\n c
            ) { })();
            `,
        },
        {
            code:
            `
            test(a +
            b, c +
            d);
            `,
            errors: [{ messageId: 'unexpectedBetween', data: { punctuator: ',' } }],
            output:
            `
            test(a +
            b,\n c +
            d);
            `,
        },
        {
            code:
            `
            describe
            (
                'test', () =>
                { },
            );
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            describe
            (
                'test',\n () =>
                { },
            );
            `,
        },
        {
            code:
            `
            [
                foo, bar +
                baz,
            ];
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            [
                foo,\n bar +
                baz,
            ];
            `,
        },
        {
            code:
            `
            [
                foo, (bar +
                baz),
            ];
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            [
                foo,\n (bar +
                baz),
            ];
            `,
        },
        {
            code:
            `
            [
                foo, (bar
                + baz),
            ];
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            [
                foo,\n (bar
                + baz),
            ];
            `,
        },
        {
            code:
            `
            [
                foo, (bar) +
                baz,
            ];
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            [
                foo,\n (bar) +
                baz,
            ];
            `,
        },
        {
            code:
            `
            [
                (
                    foo
                ), bar,
            ];
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ',' } }],
            output:
            `
            [
                (
                    foo
                ),\n bar,
            ];
            `,
        },
        {
            code:
            `
            [
                (
                foo), bar,
            ];
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ',' } }],
            output:
            `
            [
                (
                foo),\n bar,
            ];
            `,
        },
        {
            code:
            `
            [
                ,foo
                  +
                bar,
            ];
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ',' } }],
            output:
            `
            [
                ,\nfoo
                  +
                bar,
            ];
            `,
        },
        {
            code:
            `
            (foo
            = 1, bar) => baz;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ',' } }],
            output:
            `
            (foo
            = 1,\n bar) => baz;
            `,
        },
        {
            code:
            `
            foo =
            bar; baz = qux;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ';' } }],
            output:
            `
            foo =
            bar;\n baz = qux;
            `,
        },
        {
            code:
            `
            foo; bar +
            baz;
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ';' } }],
            output:
            `
            foo;\n bar +
            baz;
            `,
        },
        {
            code:
            `
            foo +
            bar; baz +
            qux;
            `,
            errors: [{ messageId: 'unexpectedBetween', data: { punctuator: ';' } }],
            output:
            `
            foo +
            bar;\n baz +
            qux;
            `,
        },
        {
            code:
            `
            for (let foo = 0; foo <
            bar; foo++) { }
            `,
            errors:
            [
                { messageId: 'unexpectedBefore', data: { punctuator: ';' } },
                { messageId: 'unexpectedAfter', data: { punctuator: ';' } },
            ],
            output:
            `
            for (let foo = 0;\n foo <
            bar;\n foo++) { }
            `,
        },
        {
            code:
            `
            do { } while (foo
            ); bar;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ';' } }],
            output:
            `
            do { } while (foo
            );\n bar;
            `,
        },
        {
            code:
            `
            const foo =
            {
                bar: baz,
            }; qux();
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ';' } }],
            output:
            `
            const foo =
            {
                bar: baz,
            };\n qux();
            `,
        },
        {
            code:
            `
            foo +
            bar < baz;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: '<' } }],
            output:
            `
            foo +
            bar <\n baz;
            `,
        },
        {
            code:
            `
            () => foo +
            bar;
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: '=>' } }],
            output:
            `
            () =>\n foo +
            bar;
            `,
        },
        {
            code:
            `
            foo =
            (
                bar
            ) => baz;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: '=>' } }],
            output:
            `
            foo =
            (
                bar
            ) =>\n baz;
            `,
        },
        {
            code:
            `
            (foo, { bar }
            = { }) => baz;
            `,
            errors:
            [
                { messageId: 'unexpectedBefore', data: { punctuator: ',' } },
                { messageId: 'unexpectedAfter', data: { punctuator: '=>' } },
            ],
            output:
            `
            (foo,\n { bar }
            = { }) =>\n baz;
            `,
        },
        {
            code:
            `
            foo ? bar +
            baz
            : qux;
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: '?' } }],
            output:
            `
            foo ?\n bar +
            baz
            : qux;
            `,
        },
        {
            code:
            `
            foo +
            bar ? baz : qux;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: '?' } }],
            output:
            `
            foo +
            bar ?\n baz : qux;
            `,
        },
        {
            code:
            `
            foo ? bar : baz +
            qux;
            `,
            errors: [{ messageId: 'unexpectedBefore', data: { punctuator: ':' } }],
            output:
            `
            foo ? bar :\n baz +
            qux;
            `,
        },
        {
            code:
            `
            foo ?
            (
                bar
            ) : baz;
            `,
            errors: [{ messageId: 'unexpectedAfter', data: { punctuator: ':' } }],
            output:
            `
            foo ?
            (
                bar
            ) :\n baz;
            `,
        },
        {
            code:
            `
            type Foo =
            {
                bar:
                string; baz:
                number;
            };
            `,
            errors:             [{ messageId: 'unexpectedBetween', data: { punctuator: ';' } }],
            output:
            `
            type Foo =
            {
                bar:
                string;\n baz:
                number;
            };
            `,
            languageOptions:    { parser: tsParser },
        },
        {
            code:
            `
            type Foo =
            Readonly<Required<
            Bar>
            >;
            `,
            errors:             [{ messageId: 'unexpectedBefore', data: { punctuator: '<' } }],
            output:
            `
            type Foo =
            Readonly<\nRequired<
            Bar>
            >;
            `,
            languageOptions:    { parser: tsParser },
        },
        {
            code:
            `
            foo<Bar>({
                baz,
            }, qux);
            `,
            errors:
            [
                { messageId: 'unexpectedBefore', data: { punctuator: '>' } },
                { messageId: 'unexpectedAfter', data: { punctuator: ',' } },
            ],
            output:
            `
            foo<Bar>\n({
                baz,
            },\n qux);
            `,
            languageOptions: { parser: tsParser },
        },
        ...[
            // All punctuators handled by the rule, except for `?`.
            '!=',   '!==',  '%=',   '&&=',  '&=',   '**=',  '*=',   '+=',   ',',    '-=',   '/=',
            ':',    ';',    '<',    '<<=',  '<=',   '=',    '==',   '===',  '=>',   '>',    '>=',
            '>>=',  '>>>=', '??=',  '^=',   '|=',   '||=',
        ]
        .map
        (
            punctuator =>
            (
                {
                    code:
                    `
                    foo ${punctuator} bar +
                    baz;
                    `,
                    errors: [{ messageId: 'unexpectedBefore', data: { punctuator } }],
                    output:
                    `
                    foo ${punctuator}\n bar +
                    baz;
                    `,
                }
            ),
        ),
    ],
};

ruleTester.run('multiline-node-layout', rule, tests);
