'use strict';

const { makeRuleDocsURL } = require('../utils');

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
    function checkSpacing(node)
    {
        const templateToken = sourceCode.getFirstToken(node);
        const prevToken = sourceCode.getTokenBefore(templateToken);
        const [, separatorStart] = prevToken.range;
        const [separatorEnd] = templateToken.range;
        const separator = sourceText.slice(separatorStart, separatorEnd);
        const match = /^(?:(?=.)\s)+(?!.)/.exec(separator);
        if (match)
        {
            const rangeToRemove = [separatorStart, separatorStart + match[0].length];
            const report =
            {
                node:       node.parent,
                loc:        prevToken.loc.end,
                messageId:  'unexpectedSpace',
                fix:        fixer => fixer.removeRange(rangeToRemove),
            };
            context.report(report);
        }
    }

    const sourceCode = context.getSourceCode();
    const sourceText = sourceCode.getText();
    const ruleListeners =
    {
        'TemplateLiteral.quasi': node => checkSpacing(node),
    };
    return ruleListeners;
}

module.exports = { meta, create };
