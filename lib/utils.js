'use strict';

function isTokenOnSameLine(left, right)
{
    const returnValue = left.loc.end.line === right.loc.start.line;
    return returnValue;
}

function makeRuleDocsURL(ruleName)
{
    const url = `https://github.com/origin-1/eslint-plugin/blob/main/rule-docs/${ruleName}.md`;
    return url;
}

module.exports = { isTokenOnSameLine, makeRuleDocsURL };
