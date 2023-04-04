'use strict';

const rule              = require('../../../lib/rules/no-spaces-in-tagged-template');
const { RuleTester }    = require('eslint');

const error =
(line, column) =>
(
    {
        message:    'Unexpected space after left side of tagged template expression.',
        type:       'TaggedTemplateExpression',
        line,
        column,
    }
);

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
const tests =
{
    valid:
    [
        'f``;',
        'f`a${b}c`;',
        'f.b``;',
        'f.b``.c``;',
        'f````',
        '(function() {}``)',
        'f`${g`0`}`',
        '( f )``',
        '( (f) )``',
        '( f```` )`0`',
        '(function(){ if (foo) { bar``; } }``);',
        'describe/**/`foo${ `` }`;',
        'f\n``;',
        'f// comment\n``',
        'f // comment\n ``',
        'f// comment\n``',
        'f\n/*\n*/\n``',
        'f\n`a${b}c`',
        'f.b\n``;',
        'f\n````',
        '(f)\n``',
        'f``;\n t``;',
        'f /**/``',
        'f\u2028``',
        'f\u2029``',
    ],
    invalid:
    [
        {
            code:   'f ``;',
            errors: [error(1, 2)],
            output: 'f``;',
        },
        {
            code:   'f `a${b}c`;',
            errors: [error(1, 2)],
            output: 'f`a${b}c`;',
        },
        {
            code:   'f.b ``;',
            errors: [error(1, 4)],
            output: 'f.b``;',
        },
        {
            code:   'f.b``.c ``;',
            errors: [error(1, 8)],
            output: 'f.b``.c``;',
        },
        {
            code:   'f.b ``.c ``;',
            errors: [error(1, 4), error(1, 9)],
            output: 'f.b``.c``;',
        },
        {
            code:   'f `` ``',
            errors: [error(1, 2), error(1, 5)],
            output: 'f````',
        },
        {
            code:   '(function() {} ``)',
            errors: [error(1, 15)],
            output: '(function() {}``)',
        },
        {
            code:   'f `${g `0`}`',
            errors: [error(1, 2), error(1, 7)],
            output: 'f`${g`0`}`',
        },
        {
            code:   '(f) ``',
            errors: [error(1, 4)],
            output: '(f)``',
        },
        {
            code:   'f ``;\n t   ``;',
            errors: [error(1, 2), error(2, 3)],
            output: 'f``;\n t``;',
        },
        {
            code:   'f.b \n ``;',
            errors: [error(1, 4)],
            output: 'f.b\n ``;',
        },
        {
            code:   'f\n`` ``.b \n``\n ``',
            errors: [error(2, 3), error(2, 8)],
            output: 'f\n````.b\n``\n ``',
        },
        {
            code:   'f.b\n``.c ``;',
            errors: [error(2, 5)],
            output: 'f.b\n``.c``;',
        },
        {
            code:   'f\n`` ``',
            errors: [error(2, 3)],
            output: 'f\n````',
        },
    ],
};
ruleTester.run('no-spaces-in-tagged-template', rule, tests);
