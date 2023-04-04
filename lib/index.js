'use strict';

const bracketLayout                 = require('./rules/bracket-layout');
const indent                        = require('./rules/indent');
const niceSpaceBeforeFunctionParen  = require('./rules/nice-space-before-function-paren');
const noSpacesInCallExpression      = require('./rules/no-spaces-in-call-expression');
const noSpacesInTaggedTemplate      = require('./rules/no-spaces-in-tagged-template');
const propertyColonSpacing          = require('./rules/property-colon-spacing');

this.rules =
{
    'bracket-layout':                   bracketLayout,
    'indent':                           indent,
    'nice-space-before-function-paren': niceSpaceBeforeFunctionParen,
    'no-spaces-in-call-expression':     noSpacesInCallExpression,
    'no-spaces-in-tagged-template':     noSpacesInTaggedTemplate,
    'property-colon-spacing':           propertyColonSpacing,
};
