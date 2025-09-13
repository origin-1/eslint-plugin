'use strict';

const { makeRuleDocsURL, reportOnSpace } = require('../utils');

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Disallow spaces after the left side of a tagged template expression',
        url:            makeRuleDocsURL('no-spaces-in-tagged-template'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    { unexpectedSpace: 'Unexpected space after left side of tagged template expression.' },
};

function create(context)
{
    function validateSpacing(node)
    {
        const templateToken = sourceCode.getFirstToken(node);
        const prevToken = sourceCode.getTokenBefore(templateToken);
        reportOnSpace(prevToken, templateToken, context, node.parent);
    }

    const { sourceCode } = context;
    const ruleListeners =
    {
        'TemplateLiteral.quasi': node => validateSpacing(node),
    };
    return ruleListeners;
}

module.exports = { meta, create };
