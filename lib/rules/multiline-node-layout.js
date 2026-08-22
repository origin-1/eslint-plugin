'use strict';

const { isClosingParenToken, isOpeningParenToken, isTokenOnSameLine, makeRuleDocsURL } =
require('../utils');

const PUNCTUATORS =
new Set(['!=', '!==', ',', ':', ';', '<', '<=', '==', '===', '=>', '>', '>=', '?']);

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Disallow multiline nodes that cross unrelated lines',
        url:            makeRuleDocsURL('multiline-node-layout'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    {
        unexpectedAfter:   'Unexpected non-trailing "{{punctuator}}" after multiline node.',
        unexpectedBefore:  'Unexpected "{{punctuator}}" before multiline node.',
        unexpectedBetween: 'Unexpected "{{punctuator}}" between multiline nodes.',
    },
    languages:  ['js/*'],
};

function isHandledPunctuator(token)
{
    const returnValue = token.type === 'Punctuator' && PUNCTUATORS.has(token.value);
    return returnValue;
}

function create(context)
{
    const { sourceCode } = context;
    // Maps each punctuator adjacent to a multiline node to the information collected about it.
    const infoMap = new Map();

    function getPunctuatorInfo(punctuator)
    {
        let info = infoMap.get(punctuator);
        if (!info)
        {
            info = { punctuator, multilineBefore: false, multilineAfter: false };
            infoMap.set(punctuator, info);
        }
        return info;
    }

    // Finds the punctuator that separates a node from the code before it, skipping any opening
    // parentheses.
    function findPunctuatorBefore(token, nextToken)
    {
        while (token && isOpeningParenToken(token))
        {
            nextToken = token;
            token = sourceCode.getTokenBefore(token);
        }
        const returnValue =
        token && isTokenOnSameLine(token, nextToken) && isHandledPunctuator(token) ? token : null;
        return returnValue;
    }

    // Finds the punctuator that separates a node from the code after it, skipping any closing
    // parentheses.
    function findPunctuatorAfter(token, prevToken)
    {
        while (token && isClosingParenToken(token))
        {
            prevToken = token;
            token = sourceCode.getTokenAfter(token);
        }
        const returnValue =
        token && isTokenOnSameLine(prevToken, token) && isHandledPunctuator(token) ? token : null;
        return returnValue;
    }

    function validateNode(node)
    {
        const { parent } = node;
        // Neither a node in a single line parent nor its wrapping parentheses can span multiple
        // lines, so such a node can be skipped without inspecting any tokens.
        if (parent && parent.loc.start.line === parent.loc.end.line) return;
        let oldTokenBefore;
        let oldTokenAfter;
        let tokenBefore = node;
        let tokenAfter = node;
        // Wrapping parentheses count as part of the node they enclose.
        do
        {
            oldTokenBefore = tokenBefore;
            oldTokenAfter = tokenAfter;
            tokenBefore = sourceCode.getTokenBefore(tokenBefore);
            tokenAfter = sourceCode.getTokenAfter(tokenAfter);
        }
        while
        (
            tokenBefore && isOpeningParenToken(tokenBefore) &&
            tokenAfter && isClosingParenToken(tokenAfter)
        );
        if (isTokenOnSameLine(oldTokenAfter, oldTokenBefore)) return;
        const punctuatorBefore = findPunctuatorBefore(tokenBefore, oldTokenBefore);
        if (punctuatorBefore)
            getPunctuatorInfo(punctuatorBefore).multilineAfter = true;
        const punctuatorAfter = findPunctuatorAfter(tokenAfter, oldTokenAfter);
        if (punctuatorAfter)
            getPunctuatorInfo(punctuatorAfter).multilineBefore = true;
    }

    const ruleListeners =
    {
        '*': validateNode,
        'Program:exit'()
        {
            for (const { punctuator, multilineBefore, multilineAfter } of infoMap.values())
            {
                let messageId;
                if (multilineAfter)
                    messageId = multilineBefore ? 'unexpectedBetween' : 'unexpectedBefore';
                else
                {
                    const tokenAfter = sourceCode.getTokenAfter(punctuator);
                    if (!tokenAfter || !isTokenOnSameLine(punctuator, tokenAfter)) continue;
                    messageId = 'unexpectedAfter';
                }
                context.report
                (
                    {
                        node:   punctuator,
                        messageId,
                        data:   { punctuator: punctuator.value },
                        fix:    fixer => fixer.insertTextAfter(punctuator, '\n'),
                    },
                );
            }
        },
    };
    return ruleListeners;
}

module.exports = { meta, create };
