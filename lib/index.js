'use strict';

const bracketLayout                 = require('./rules/bracket-layout');
const niceSpaceBeforeFunctionParen  = require('./rules/nice-space-before-function-paren');
const noSpacesInCallExpression      = require('./rules/no-spaces-in-call-expression');
const propertyColonSpacing          = require('./rules/property-colon-spacing');

this.rules =
{
    'bracket-layout':                   bracketLayout,
    'nice-space-before-function-paren': niceSpaceBeforeFunctionParen,
    'no-spaces-in-call-expression':     noSpacesInCallExpression,
    'property-colon-spacing':           propertyColonSpacing,
};
