'use strict';

const { isOpeningParenToken, makeRuleDocsURL, reportOnSpace } = require('../utils');

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Disallow spaces after the left side of a call or new expression',
        url:            makeRuleDocsURL('no-spaces-in-call-expression'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    { unexpectedSpace: 'Unexpected space after left side of {{exprTypeName}} expression.' },
};

function create(context)
{
    function validateSpacing(node, exprTypeName)
    {
        let prevToken = sourceCode.getLastToken(node.callee);
        let parenToken = sourceCode.getTokenAfter(prevToken);
        for (;;)
        {
            if (!(parenToken && parenToken.range[1] < node.range[1]))
                return;
            if (isOpeningParenToken(parenToken))
                break;
            prevToken = parenToken;
            parenToken = sourceCode.getTokenAfter(parenToken);
        }
        reportOnSpace(prevToken, parenToken, context, node, { exprTypeName });
    }

    const { sourceCode } = context;
    const ruleListeners =
    {
        CallExpression: node => validateSpacing(node, 'call'),
        NewExpression:  node => validateSpacing(node, 'new'),
    };
    return ruleListeners;
}

module.exports = { meta, create };
