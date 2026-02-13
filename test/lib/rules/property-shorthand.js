'use strict';

const rule          = require('../../../lib/rules/property-shorthand');
const RuleTester    = require('./rule-tester');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        'const obj = { foo };',
        'const obj = { foo() {} };',
        'const obj = { foo: bar };',
        'const obj = { [foo]: bar };',
        'const obj = { "foo": foo };',
        'const obj = { foo: (foo) };',
        'const obj = { foo: /* comment */ foo };',
        'const obj = { foo /* comment */ : foo };',
        'const obj = { __proto__: __proto__ };',
        'const obj = { this: this };',
        'const { foo: foo } = obj;',
        {
            code:               'var obj = { foo: foo };',
            languageOptions:    { ecmaVersion: 5, sourceType: 'script' },
        },
    ],
    invalid:
    [
        {
            code:   'const obj = { foo: foo };',
            output: 'const obj = { foo };',
            errors:
            [
                {
                    messageId:  'expectedPropertyShorthand',
                    data:       { name: 'foo' },
                    line:       1,
                    column:     15,
                    endLine:    1,
                    endColumn:  23,
                },
            ],
        },
        {
            code:   'const obj = { f\\u006fo: fo\\u006f };',
            output: 'const obj = { f\\u006fo };',
            errors:
            [
                {
                    messageId:  'expectedPropertyShorthand',
                    data:       { name: 'foo' },
                    line:       1,
                    column:     15,
                    endLine:    1,
                    endColumn:  33,
                },
            ],
        },
    ],
};

ruleTester.run('property-shorthand', rule, tests);
