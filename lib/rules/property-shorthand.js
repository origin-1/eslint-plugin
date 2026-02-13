'use strict';

const { makeRuleDocsURL } = require('../utils');

const meta =
{
    type:       'suggestion',
    docs:
    {
        description:    'Enforce property shorthand syntax',
        url:            makeRuleDocsURL('property-shorthand'),
    },
    fixable:    'code',
    schema:     [],
    messages:   { expectedPropertyShorthand: 'Expected shorthand for property {{name}}.' },
};

function create(context)
{
    function checkProperty(property)
    {
        if (property.shorthand || property.computed) return;
        const { key } = property;
        if (key.type !== 'Identifier') return;
        const keyName = key.name;
        if (keyName === '__proto__') return;
        const { value } = property;
        if (value.type !== 'Identifier') return;
        const valueName = value.name;
        if (keyName !== valueName) return;
        if
        (
            sourceCode.getTokenAfter(key, { includeComments: true }) ===
            sourceCode.getTokenBefore(value, { includeComments: true })
        )
            reportProperty(property);
    }

    function reportProperty(property)
    {
        const { key } = property;
        const keyText = sourceCode.getText(key);
        const report =
        {
            node:       property,
            messageId:  'expectedPropertyShorthand',
            data:       { name: key.name },
            fix:        fixer => fixer.replaceText(property, keyText),
        };
        context.report(report);
    }

    const { sourceCode } = context;
    const ruleListeners =
    context.languageOptions.ecmaVersion < 2015 ?
    { } : { 'ObjectExpression>Property.properties': checkProperty };
    return ruleListeners;
}

module.exports = { meta, create };
