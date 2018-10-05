'use strict';

const niceSpaceBeforeFunctionParen = require('./nice-space-before-function-paren');
const noSpacesInCallExpression = require('./no-spaces-in-call-expression');

module.exports.rules =
{
    'nice-space-before-function-paren': niceSpaceBeforeFunctionParen,
    'no-spaces-in-call-expression': noSpacesInCallExpression,
};
