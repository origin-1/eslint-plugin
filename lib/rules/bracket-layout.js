'use strict';

const { isTokenOnSameLine, makeRuleDocsURL } = require('../utils');

const BRACKET_SET = new Set('()[]{}');
const PRE_DETACHED_PUNCTUATOR_SET = new Set([...'(.)[]{}', '?.']);
const POST_ATTACHED_PUNCTUATOR_SET = new Set([...'!+-^~', '++', '--', '...', '?.']);

function isBracketToken(token)
{
    const returnValue = token.type === 'Punctuator' && BRACKET_SET.has(token.value);
    return returnValue;
}

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Enforce consistent bracket layout',
        url:            makeRuleDocsURL('bracket-layout'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    {
        sameLineBeforeOpen: 'Opening bracket "{{bracket}}" should be on next line.',
        sameLineAfterOpen:  'Code after opening bracket "{{bracket}}" should be on next line.',
        sameLineBeforeClose:
        'Closing bracket "{{bracket}}" should be on the same line as opening bracket or after ' +
        'the previous line of code.',
        sameLineAfterClose: 'Code after closing bracket "{{bracket}}" should be on next line.',
    },
};

function create(context)
{
    function canBreakAfter(token)
    {
        let returnValue;
        {
            const { type, value } = token;
            if (type === 'Punctuator')
                returnValue = !POST_ATTACHED_PUNCTUATOR_SET.has(token.value);
            else if (type === 'Identifier' && value === 'async')
                returnValue = !isInNodeOfType(token, 'ArrowFunctionExpression');
            else if (type === 'Keyword' && value === 'return')
                returnValue = !isInNodeOfType(token, 'ReturnStatement');
            else if (type === 'Keyword' && value === 'throw')
                returnValue = !isInNodeOfType(token, 'ThrowStatement');
            else if (type === 'Keyword' && value === 'yield')
                returnValue = !isInNodeOfType(token, 'YieldExpression');
            else
                returnValue = true;
        }
        return returnValue;
    }

    function canBreakBefore(token)
    {
        let returnValue;
        const { type, value } = token;
        if (type === 'Punctuator')
            returnValue = PRE_DETACHED_PUNCTUATOR_SET.has(token.value);
        else if (type === 'Identifier' && value === 'as')
            returnValue = !isInNodeOfType(token, 'TSAsExpression');
        else if (type === 'Identifier' && value === 'satisfies')
            returnValue = !isInNodeOfType(token, 'TSSatisfiesExpression');
        else
            returnValue = true;
        return returnValue;
    }

    function isInNodeOfType(token, type)
    {
        const [index] = token.range;
        const node = sourceCode.getNodeByRangeIndex(index);
        const returnValue = node.type === type;
        return returnValue;
    }

    function validateBracketPair(openingBracket, closingBracket)
    {
        if (isTokenOnSameLine(openingBracket, closingBracket))
            return;
        {
            const tokenBeforeOpeningBracket = sourceCode.getTokenBefore(openingBracket);
            if
            (
                tokenBeforeOpeningBracket &&
                isTokenOnSameLine(tokenBeforeOpeningBracket, openingBracket) &&
                canBreakAfter(tokenBeforeOpeningBracket)
            )
            {
                context.report
                (
                    {
                        node:       openingBracket,
                        messageId:  'sameLineBeforeOpen',
                        data:       { bracket: openingBracket.value },
                        fix:        fixer => fixer.insertTextBefore(openingBracket, '\n'),
                    },
                );
            }
        }
        {
            const tokenAfterOpeningBracket = sourceCode.getTokenAfter(openingBracket);
            if (isTokenOnSameLine(openingBracket, tokenAfterOpeningBracket))
            {
                context.report
                (
                    {
                        node:       openingBracket,
                        messageId:  'sameLineAfterOpen',
                        data:       { bracket: openingBracket.value },
                        fix:        fixer => fixer.insertTextAfter(openingBracket, '\n'),
                    },
                );
            }
        }
        {
            const tokenBeforeClosingBracket = sourceCode.getTokenBefore(closingBracket);
            if (isTokenOnSameLine(tokenBeforeClosingBracket, closingBracket))
            {
                context.report
                (
                    {
                        node:       closingBracket,
                        messageId:  'sameLineBeforeClose',
                        data:       { bracket: closingBracket.value },
                        fix:        fixer => fixer.insertTextBefore(closingBracket, '\n'),
                    },
                );
            }
        }
        {
            const tokenAfterClosingBracket = sourceCode.getTokenAfter(closingBracket);
            if
            (
                tokenAfterClosingBracket &&
                isTokenOnSameLine(closingBracket, tokenAfterClosingBracket) &&
                canBreakBefore(tokenAfterClosingBracket)
            )
            {
                context.report
                (
                    {
                        node:       closingBracket,
                        messageId:  'sameLineAfterClose',
                        data:       { bracket: closingBracket.value },
                        fix:        fixer => fixer.insertTextAfter(closingBracket, '\n'),
                    },
                );
            }
        }
    }

    function validateProgram(node)
    {
        const tokens = sourceCode.getFirstTokens(node, { filter: isBracketToken });
        const stack = [];
        for (const token of tokens)
        {
            const { value } = token;
            if (value === '(' || value === '[' || value === '{')
                stack.push(token);
            else
            {
                const openingBracket = stack.pop();
                const closingBracket = token;
                validateBracketPair(openingBracket, closingBracket);
            }
        }
    }

    const sourceCode = context.getSourceCode();
    const ruleListeners = { Program: validateProgram };
    return ruleListeners;
}

module.exports = { meta, create };
