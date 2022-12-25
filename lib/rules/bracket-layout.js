'use strict';

const { bracketPairsIn, isTokenOnSameLine, makeRuleDocsURL } = require('../utils');

const PRE_DETACHED_PUNCTUATOR_SET = new Set([...'(.)[]{}', '?.']);
const POST_ATTACHED_PUNCTUATOR_SET = new Set([...'!+-^~', '++', '--', '...', '?.']);

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
    function canBreakAfterToken(token)
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

    function canBreakBeforeToken(token)
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

    function canBreakBeforeBracket(openingBracket)
    {
        const returnValue =
        openingBracket.value !== '<' ||
        sourceCode.getNodeByRangeIndex(openingBracket.range[0]).type !==
        'TSTypeParameterInstantiation';
        return returnValue;
    }

    function isInNodeOfType(token, type)
    {
        const [index] = token.range;
        const node = sourceCode.getNodeByRangeIndex(index);
        const returnValue = node.type === type;
        return returnValue;
    }

    function report(bracket, messageId, loc, index)
    {
        const fix = fixer => fixer.insertTextBeforeRange([index], '\n');
        context.report
        (
            {
                node:   bracket,
                loc:    { start: loc, end: loc },
                messageId,
                data:   { bracket: bracket.value },
                fix,
            },
        );
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
                canBreakAfterToken(tokenBeforeOpeningBracket) &&
                canBreakBeforeBracket(openingBracket)
            )
            {
                report
                (
                    openingBracket,
                    'sameLineBeforeOpen',
                    openingBracket.loc.start,
                    openingBracket.range[0],
                );
            }
        }
        {
            const tokenAfterOpeningBracket = sourceCode.getTokenAfter(openingBracket);
            if (isTokenOnSameLine(openingBracket, tokenAfterOpeningBracket))
            {
                report
                (
                    openingBracket,
                    'sameLineAfterOpen',
                    openingBracket.loc.end,
                    openingBracket.range[1],
                );
            }
        }
        {
            const tokenBeforeClosingBracket = sourceCode.getTokenBefore(closingBracket);
            if (isTokenOnSameLine(tokenBeforeClosingBracket, closingBracket))
            {
                report
                (
                    closingBracket,
                    'sameLineBeforeClose',
                    closingBracket.loc.start,
                    closingBracket.range[0],
                );
            }
        }
        {
            const tokenAfterClosingBracket = sourceCode.getTokenAfter(closingBracket);
            if
            (
                tokenAfterClosingBracket &&
                isTokenOnSameLine(closingBracket, tokenAfterClosingBracket) &&
                canBreakBeforeToken(tokenAfterClosingBracket)
            )
            {
                report
                (
                    closingBracket,
                    'sameLineAfterClose',
                    closingBracket.loc.end,
                    closingBracket.range[1],
                );
            }
        }
    }

    function validateProgram()
    {
        for (const [openingBracket, closingBracket] of bracketPairsIn(sourceCode))
            validateBracketPair(openingBracket, closingBracket);
    }

    const sourceCode = context.getSourceCode();
    const ruleListeners = { Program: validateProgram };
    return ruleListeners;
}

module.exports = { meta, create };
