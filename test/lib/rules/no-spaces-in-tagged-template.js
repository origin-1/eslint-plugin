'use strict';

const rule          = require('../../../lib/rules/no-spaces-in-tagged-template');
const RuleTester    = require('./rule-tester');

const error =
(line, column, endColumn) =>
(
    {
        message:    'Unexpected space after left side of tagged template expression.',
        line,
        column,
        endLine:    line,
        endColumn,
    }
);

const ruleTester = new RuleTester();
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
            errors: [error(1, 2, 3)],
            output: 'f``;',
        },
        {
            code:   'f `a${b}c`;',
            errors: [error(1, 2, 3)],
            output: 'f`a${b}c`;',
        },
        {
            code:   'f.b ``;',
            errors: [error(1, 4, 5)],
            output: 'f.b``;',
        },
        {
            code:   'f.b``.c ``;',
            errors: [error(1, 8, 9)],
            output: 'f.b``.c``;',
        },
        {
            code:   'f.b ``.c ``;',
            errors: [error(1, 4, 5), error(1, 9, 10)],
            output: 'f.b``.c``;',
        },
        {
            code:   'f `` ``',
            errors: [error(1, 2, 3), error(1, 5, 6)],
            output: 'f````',
        },
        {
            code:   '(function() {} ``)',
            errors: [error(1, 15, 16)],
            output: '(function() {}``)',
        },
        {
            code:   'f `${g `0`}`',
            errors: [error(1, 2, 3), error(1, 7, 8)],
            output: 'f`${g`0`}`',
        },
        {
            code:   '(f) ``',
            errors: [error(1, 4, 5)],
            output: '(f)``',
        },
        {
            code:   'f ``;\n t   ``;',
            errors: [error(1, 2, 3), error(2, 3, 6)],
            output: 'f``;\n t``;',
        },
        {
            code:   'f.b \n ``;',
            errors: [error(1, 4, 5)],
            output: 'f.b\n ``;',
        },
        {
            code:   'f\n`` ``.b \n``\n ``',
            errors: [error(2, 3, 4), error(2, 8, 9)],
            output: 'f\n````.b\n``\n ``',
        },
        {
            code:   'f.b\n``.c ``;',
            errors: [error(2, 5, 6)],
            output: 'f.b\n``.c``;',
        },
        {
            code:   'f\n`` ``',
            errors: [error(2, 3, 4)],
            output: 'f\n````',
        },
    ],
};
ruleTester.run('no-spaces-in-tagged-template', rule, tests);
