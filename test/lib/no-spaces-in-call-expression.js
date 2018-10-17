'use strict';

const RuleTester = require('eslint/lib/testers/rule-tester');
const plugin = require('../..');

const callExprError =
(line, column) =>
(
    {
        message: 'Unexpected space after left side of call expression.',
        type: 'CallExpression',
        line,
        column,
    }
);

const newExprError =
(line, column) =>
(
    {
        message: 'Unexpected space after left side of new expression.',
        type: 'NewExpression',
        line,
        column,
    }
);

const ruleTester = new RuleTester();
const rule = plugin.rules['no-spaces-in-call-expression'];
const test =
{
    valid:
    [
        'f();',
        'f(a, b);',
        'f.b();',
        'f.b().c();',
        'f()()',
        '(function() {}())',
        'var f = new Foo()',
        'var f = new Foo',
        'f( (0) )',
        '( f )( 0 )',
        '( (f) )( (0) )',
        '( f()() )(0)',
        '(function(){ if (foo) { bar(); } }());',
        'f(0, (1))',
        'describe/**/("foo", function () {});',
        'new (foo())',
        'f\n();',
        'var f = new Foo\n();',
        'f// comment\n()',
        'f // comment\n ()',
        'f// comment\n()',
        'f\n/*\n*/\n()',
        'f\n(a, b)',
        'f.b\n();',
        'f\n()()',
        '(f)(0)',
        'f();\n t();',
        'f /**/()',
        'f\u2028()',
        'f\u2029()',
    ],
    invalid:
    [
        {
            code: 'f ();',
            errors: [callExprError(1, 2)],
            output: 'f();',
        },
        {
            code: 'f (a, b);',
            errors: [callExprError(1, 2)],
            output: 'f(a, b);',
        },
        {
            code: 'f.b ();',
            errors: [callExprError(1, 4)],
            output: 'f.b();',
        },
        {
            code: 'f.b().c ();',
            errors: [callExprError(1, 8)],
            output: 'f.b().c();',
        },
        {
            code: 'f.b ().c ();',
            errors: [callExprError(1, 4), callExprError(1, 9)],
            output: 'f.b().c();',
        },
        {
            code: 'f () ()',
            errors: [callExprError(1, 2), callExprError(1, 5)],
            output: 'f()()',
        },
        {
            code: '(function() {} ())',
            errors: [callExprError(1, 15)],
            output: '(function() {}())',
        },
        {
            code: 'var f = new Foo ()',
            errors: [newExprError(1, 16)],
            output: 'var f = new Foo()',
        },
        {
            code: 'f ( (0) )',
            errors: [callExprError(1, 2)],
            output: 'f( (0) )',
        },
        {
            code: 'f (0) (1)',
            errors: [callExprError(1, 2), callExprError(1, 6)],
            output: 'f(0)(1)',
        },
        {
            code: '(f) (0)',
            errors: [callExprError(1, 4)],
            output: '(f)(0)',
        },
        {
            code: 'f ();\n t   ();',
            errors: [callExprError(1, 2), callExprError(2, 3)],
            output: 'f();\n t();',
        },
        {
            code: 'f.b \n ();',
            errors: [callExprError(1, 4)],
            output: 'f.b\n ();',
        },
        {
            code: 'f\n() ().b \n()\n ()',
            errors: [callExprError(2, 3), callExprError(2, 8)],
            output: 'f\n()().b\n()\n ()',
        },
        {
            code: 'f.b\n().c ();',
            errors: [callExprError(2, 5)],
            output: 'f.b\n().c();',
        },
        {
            code: 'f() ()',
            errors: [callExprError(1, 4)],
            output: 'f()()',
        },
        {
            code: 'f\n() ()',
            errors: [callExprError(2, 3)],
            output: 'f\n()()',
        },
        {
            code: 'f(0) (1)',
            errors: [callExprError(1, 5)],
            output: 'f(0)(1)',
        },
    ],
};
ruleTester.run('no-spaces-in-call-expression', rule, test);
