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
            code:   'var foo = new Object();',
            errors: [{ messageId: 'unexpected', type: 'NewExpression' }],
        },
        {
            code:   'new Object();',
            errors: [{ messageId: 'unexpected', type: 'NewExpression' }],
        },
        {
            code:   'const a = new Object();',
            errors: [{ messageId: 'unexpected', type: 'NewExpression' }],
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
            errors: Array(11).fill({ messageId: 'unexpected', type: 'NewExpression' }),
        },
        {
            code:   'throw new AggregateError(errors);',
            errors: [{ messageId: 'unexpected', type: 'NewExpression' }],
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
            errors: [{ messageId: 'unexpected', type: 'NewExpression' }],
        },
    ],
};

ruleTester.run('no-extra-new', rule, tests);
