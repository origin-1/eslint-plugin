'use strict';

const rule          = require('../../../lib/rules/no-extra-new');
const RuleTester    = require('./rule-tester');

const ruleTester = new RuleTester();
const tests =
{
    valid:
    [
        'var myObject = {};',
        'var myObject = new CustomObject();',
        'var foo = new foo.Object();',
        `
        var Object = function Object() {};
        new Object();
        `,
        `
        var x = something ? MyClass : Object;
        var y = new x();`,
        `
        class Object
        {
            constructor() { }
        }
        new Object();
        `,
        `
        import { Object } from './';
        new Object();
        `,
        `
        var Error = CustomError;
        function foo()
        {
            throw new Error();
        }
        `,
        `
        function foo()
        {
            throw new Error();
        }
        const Error = CustomError;
        `,
        {
            code:               'throw new AggregateError(errors);',
            languageOptions:    { globals: { AggregateError: 'off' } },
        },
        {
            code:               '(new Function(foo))();',
            languageOptions:    { globals: { Function: 'off' } },
        },
        `
        /* global RegExp:off */
        new RegExp(pattern, flags);
        `,
    ],
    invalid:
    [
        {
            code: 'var foo = new Object();',
            errors:
            [
                {
                    messageId:  'unexpected',
                    line:       1,
                    column:     11,
                    endLine:    1,
                    endColumn:  23,
                },
            ],
        },
        {
            code: 'new Object();',
            errors:
            [
                {
                    messageId:  'unexpected',
                    line:       1,
                    column:     1,
                    endLine:    1,
                    endColumn:  13,
                },
            ],
        },
        {
            code: 'const a = new Object();',
            errors:
            [
                {
                    messageId:  'unexpected',
                    line:       1,
                    column:     11,
                    endLine:    1,
                    endColumn:  23,
                },
            ],
        },
        {
            code:
            `
            new Array;
            new Error;
            new EvalError;
            new Function;
            new Object;
            new RangeError;
            new ReferenceError;
            new RegExp;
            new SyntaxError;
            new TypeError;
            new URIError;
            `,
            errors: Array(11).fill({ messageId: 'unexpected' }),
        },
        {
            code: 'throw new AggregateError(errors);',
            errors:
            [
                {
                    messageId:  'unexpected',
                    line:       1,
                    column:     7,
                    endLine:    1,
                    endColumn:  33,
                },
            ],
        },
        {
            code:
            `
            function foo(Error)
            {
                throw new Error;
            }
            throw new Error;
            `,
            errors:
            [
                {
                    messageId:  'unexpected',
                    line:       6,
                    column:     19,
                    endLine:    6,
                    endColumn:  28,
                },
            ],
        },
    ],
};

ruleTester.run('no-extra-new', rule, tests);
