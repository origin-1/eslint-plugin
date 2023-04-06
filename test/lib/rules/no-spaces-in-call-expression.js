'use strict';

const rule              = require('../../../lib/rules/no-spaces-in-call-expression');
const { RuleTester }    = require('eslint');

const callExprError =
(line, column, endColumn) =>
(
    {
        message:    'Unexpected space after left side of call expression.',
        type:       'CallExpression',
        line,
        column,
        endLine:    line,
        endColumn,
    }
);

const newExprError =
(line, column, endColumn) =>
(
    {
        message:    'Unexpected space after left side of new expression.',
        type:       'NewExpression',
        line,
        column,
        endLine:    line,
        endColumn,
    }
);

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });
const tests =
{
    valid:
    [
        'f();',
        'f?.();',
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
        'f?.\n();',
        'var f = new Foo\n();',
        'f// comment\n()',
        'f // comment\n ()',
        'f// comment\n()',
        'f\n/*\n*/\n()',
        'f\n(a, b)',
        'f.b\n();',
        'f\n()()',
        '(f)\n(0)',
        'f();\n t();',
        'f /**/()',
        'f?./**/ ()',
        'f\u2028()',
        'f\u2029()',
    ],
    invalid:
    [
        {
            code:   'f ();',
            errors: [callExprError(1, 2, 3)],
            output: 'f();',
        },
        {
            code:   'f?. ();',
            errors: [callExprError(1, 4, 5)],
            output: 'f?.();',
        },
        {
            code:   'f (a, b);',
            errors: [callExprError(1, 2, 3)],
            output: 'f(a, b);',
        },
        {
            code:   'f.b ();',
            errors: [callExprError(1, 4, 5)],
            output: 'f.b();',
        },
        {
            code:   'f.b().c ();',
            errors: [callExprError(1, 8, 9)],
            output: 'f.b().c();',
        },
        {
            code:   'f.b ().c ();',
            errors: [callExprError(1, 4, 5), callExprError(1, 9, 10)],
            output: 'f.b().c();',
        },
        {
            code:   'f () ()',
            errors: [callExprError(1, 2, 3), callExprError(1, 5, 6)],
            output: 'f()()',
        },
        {
            code:   '(function() {} ())',
            errors: [callExprError(1, 15, 16)],
            output: '(function() {}())',
        },
        {
            code:   'var f = new Foo ()',
            errors: [newExprError(1, 16, 17)],
            output: 'var f = new Foo()',
        },
        {
            code:   'f ( (0) )',
            errors: [callExprError(1, 2, 3)],
            output: 'f( (0) )',
        },
        {
            code:   'f (0) (1)',
            errors: [callExprError(1, 2, 3), callExprError(1, 6, 7)],
            output: 'f(0)(1)',
        },
        {
            code:   '(f) (0)',
            errors: [callExprError(1, 4, 5)],
            output: '(f)(0)',
        },
        {
            code:   'f ();\n t   ();',
            errors: [callExprError(1, 2, 3), callExprError(2, 3, 6)],
            output: 'f();\n t();',
        },
        {
            code:   'f.b \n ();',
            errors: [callExprError(1, 4, 5)],
            output: 'f.b\n ();',
        },
        {
            code:   'f\n() ().b \n()\n ()',
            errors: [callExprError(2, 3, 4), callExprError(2, 8, 9)],
            output: 'f\n()().b\n()\n ()',
        },
        {
            code:   'f.b\n().c ();',
            errors: [callExprError(2, 5, 6)],
            output: 'f.b\n().c();',
        },
        {
            code:   'f() ()',
            errors: [callExprError(1, 4, 5)],
            output: 'f()()',
        },
        {
            code:   'f\n() ()',
            errors: [callExprError(2, 3, 4)],
            output: 'f\n()()',
        },
        {
            code:   'f(0) (1)',
            errors: [callExprError(1, 5, 6)],
            output: 'f(0)(1)',
        },
    ],
};
ruleTester.run('no-spaces-in-call-expression', rule, tests);
