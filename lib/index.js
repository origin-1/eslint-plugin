'use strict';

const niceSpaceBeforeFunctionParen  = require('./rules/nice-space-before-function-paren');
const noSpacesInCallExpression      = require('./rules/no-spaces-in-call-expression');

this.rules =
{
    'nice-space-before-function-paren': niceSpaceBeforeFunctionParen,
    'no-spaces-in-call-expression':     noSpacesInCallExpression,
};
