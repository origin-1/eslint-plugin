'use strict';

const rule             = require('../../../lib/rules/property-colon-spacing');
const { RuleTester }   = require('eslint');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        {
            code:
            '({ foo: bar, [bar]: foo, 1: 1, baz, a() { }, get b() { }, set b(b) { }, ...c })',
            parserOptions: { ecmaVersion: 2018 },
        },
        {
            code:
            `
            ({ a
                 :
                   b })
            `,
        },
        {
            code: '({ a /* - */: b })',
        },
        {
            code:
            `
            ({
                a:      'A',
                bb:     'B',
                ccc:    'C',
            })
            `,
        },
        {
            code:
            `
            foo = {
                "🌷": "bar", // 2 code points
                "🎁": "baz", // 2 code points
                "🇮🇳": "qux", // 4 code points
                "🏳️‍🌈": "xyz", // 6 code points
            };
            `,
        },
        {
            code:
            `
            const obj =
            {
                foo:     1,
                 [bar]:  2,
                'baz':   3,
                [
                    'multiline key'
                ]: 4,
                'value on next line':
                    5,
                shortcut,
                get accessor()
                { },
                set accessor(value)
                { },
                method()
                { },
                ...spread,
            };
            `,
            parserOptions: { ecmaVersion: 2018 },
        },
    ],
    invalid:
    [
        {
            code:
            '({ a() { }, get b() { }, set b(b) { }, ...c, foo : bar })',
            parserOptions: { ecmaVersion: 2018 },
            output:
            '({ a() { }, get b() { }, set b(b) { }, ...c, foo: bar })',
            errors:
            [
                {
                    messageId:  'extraSpaceBeforeColon',
                    data:       { computed: '', key: 'foo' },
                    line:       1,
                    column:     49,
                    endLine:    1,
                    endColumn:  50,
                    type:       'Punctuator',
                },
            ],
        },
        {
            code:
            '({ __proto__ : null, foo : bar, [bar] : foo, "baz" : baz, 1 : 42, [a+\nb] : c })',
            parserOptions: { ecmaVersion: 2018 },
            output:
            '({ __proto__: null, foo: bar, [bar]: foo, "baz": baz, 1: 42, [a+\nb]: c })',
            errors:
            [
                { messageId: 'extraSpaceBeforeColon', data: { computed: '', key: '__proto__' } },
                { messageId: 'extraSpaceBeforeColon', data: { computed: '', key: 'foo' } },
                { messageId: 'extraSpaceBeforeColon', data: { computed: 'computed ', key: 'bar' } },
                { messageId: 'extraSpaceBeforeColon', data: { computed: '', key: 'baz' } },
                { messageId: 'extraSpaceBeforeColon', data: { computed: '', key: '1' } },
                {
                    messageId:  'extraSpaceBeforeColon',
                    data:       { computed: 'computed ', key: 'a+\nb' },
                },
            ],
        },
        {
            code:
            `
            ({ a
            /* - */ : b })
            `,
            output:
            `
            ({ a
            /* - */: b })
            `,
            errors:
            [
                {
                    messageId:  'extraSpaceBeforeColon',
                    line:       3,
                    column:     20,
                    endLine:    3,
                    endColumn:  21,
                },
            ],
        },
        {
            code:   '({a\t\f\v:\xa0\u2000b})',
            output: '({a:\xa0b})',
            errors:
            [
                {
                    messageId:  'extraSpaceBeforeColon',
                    line:       1,
                    column:     4,
                    endLine:    1,
                    endColumn:  7,
                },
                {
                    messageId:  'extraSpaceAfterColon',
                    line:       1,
                    column:     8,
                    endLine:    1,
                    endColumn:  10,
                },
            ],
        },
        {
            code:   'foo = { bar:baz }',
            output: 'foo = { bar: baz }',
            errors:
            [
                {
                    messageId:  'missingSpaceAfterColon',
                    data:       { computed: '', key: 'bar' },
                    line:       1,
                    column:     13,
                    endLine:    1,
                    endColumn:  13,
                    type:       'Punctuator',
                },
            ],
        },
        {
            code:
            `
            ({
                foo: 1,
                bar:        2,
                ...baz,
                foobar:3,
                barfoo:  4,
                baz:
                5,
            })
            `,
            parserOptions: { ecmaVersion: 2018 },
            output:
            `
            ({
                foo:     1,
                bar:     2,
                ...baz,
                foobar:  3,
                barfoo:  4,
                baz:
                5,
            })
            `,
            errors:
            [
                {
                    messageId:  'missingSpaceAfterColon',
                    data:       { computed: '', key: 'foo' },
                    line:       3,
                    column:     21,
                    endLine:    3,
                    endColumn:  22,
                },
                {
                    messageId:  'extraSpaceAfterColon',
                    data:       { computed: '', key: 'bar' },
                    line:       4,
                    column:     21,
                    endLine:    4,
                    endColumn:  29,
                },
                {
                    messageId:  'missingSpaceAfterColon',
                    data:       { computed: '', key: 'foobar' },
                    line:       6,
                    column:     24,
                    endLine:    6,
                    endColumn:  24,
                },
            ],
        },
        {
            code:
            `
            var x =
            {
                foobar:1,
                baz: 2,
            };
            `,
            output:
            `
            var x =
            {
                foobar: 1,
                baz:    2,
            };
            `,
            errors:
            [
                { messageId: 'missingSpaceAfterColon', data: { computed: '', key: 'foobar' } },
                { messageId: 'missingSpaceAfterColon', data: { computed: '', key: 'baz' } },
            ],
        },
        {
            code:
            '({ __proto__:  null, foo:  bar, [bar]:  foo, "baz":  baz, 1:  42, [a+\nb]:  c })',
            parserOptions: { ecmaVersion: 2015 },
            output:
            '({ __proto__: null, foo: bar, [bar]: foo, "baz": baz, 1: 42, [a+\nb]: c })',
            errors:
            [
                { messageId: 'extraSpaceAfterColon', data: { computed: '', key: '__proto__' } },
                { messageId: 'extraSpaceAfterColon', data: { computed: '', key: 'foo' } },
                { messageId: 'extraSpaceAfterColon', data: { computed: 'computed ', key: 'bar' } },
                { messageId: 'extraSpaceAfterColon', data: { computed: '', key: 'baz' } },
                { messageId: 'extraSpaceAfterColon', data: { computed: '', key: '1' } },
                {
                    messageId:  'extraSpaceAfterColon',
                    data:       { computed: 'computed ', key: 'a+\nb' },
                },
            ],
        },
        {
            code:
            `
            (
                {
                    foo:  bar,
                    bar : foo,
                }
            )
            `,
            output:
            `
            (
                {
                    foo:  bar,
                    bar:  foo,
                }
            )
            `,
            errors:
            [
                { messageId: 'extraSpaceBeforeColon' },
                { messageId: 'missingSpaceAfterColon' },
            ],
        },
    ],
};

ruleTester.run('property-colon-spacing', rule, tests);
