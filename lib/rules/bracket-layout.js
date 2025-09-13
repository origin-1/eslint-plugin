'use strict';

const
{ bracketPairsIn, isClosingParenToken, isOpeningParenToken, isTokenOnSameLine, makeRuleDocsURL } =
require('../utils');

const PRE_DETACHED_PUNCTUATOR_SET = new Set([...'(.)]{}', '?.']);
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
        if (type === 'Punctuator' && value === '[')
            returnValue = !isInNodeOfType(token, 'TSArrayType');
        else if (type === 'Punctuator')
            returnValue = PRE_DETACHED_PUNCTUATOR_SET.has(value);
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
        let returnValue;
        switch (openingBracket.value)
        {
        case '<':
            returnValue = !isInNodeOfType(openingBracket, 'TSTypeParameterInstantiation');
            break;
        case '[':
            returnValue = !isInNodeOfType(openingBracket, 'TSIndexedAccessType');
            break;
        default:
            returnValue = true;
            break;
        }
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
                !validJunctionSet.has(openingBracket.range[0]) &&
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
            if
            (
                isTokenOnSameLine(openingBracket, tokenAfterOpeningBracket) &&
                !validJunctionSet.has(openingBracket.range[1])
            )
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
            if
            (
                isTokenOnSameLine(tokenBeforeClosingBracket, closingBracket) &&
                !validJunctionSet.has(closingBracket.range[0])
            )
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
                !validJunctionSet.has(closingBracket.range[1]) &&
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

    function validateIIFE(node)
    {
        const callExpr = node.parent;
        if (callExpr.optional)
            return;
        const outerCalleeFirstLine = node.loc.start.line;
        let tokenBeforeParamsOpeningParen;
        const tokenAfterCallee = sourceCode.getTokenAfter(node);
        if (isClosingParenToken(tokenAfterCallee))
        {
            // The callee is wrapped in parentheses.
            const calleeClosingParen = tokenAfterCallee;
            const tokenAfterCalleeClosingParen = sourceCode.getTokenAfter(calleeClosingParen);
            if (!isOpeningParenToken(tokenAfterCalleeClosingParen))
                return; // The callee is apparently wrapped in additional parentheses.
            const calleeOpeningParen = sourceCode.getTokenBefore(node);
            if (calleeOpeningParen.loc.end.line < outerCalleeFirstLine)
                return; // Opening parenthesis is not on the same line as the callee.
            tokenBeforeParamsOpeningParen = calleeClosingParen;
            validJunctionSet.add(calleeOpeningParen.range[1]);
            validJunctionSet.add(node.range[0]);
            validJunctionSet.add(node.range[1]);
            validJunctionSet.add(calleeClosingParen.range[0]);
        }
        else
            tokenBeforeParamsOpeningParen = node;
        const outerCalleeLastLine = tokenBeforeParamsOpeningParen.loc.end.line;
        const paramsClosingParen = sourceCode.getLastToken(node.parent);
        if (paramsClosingParen.loc.end.line === outerCalleeLastLine)
            validJunctionSet.add(tokenBeforeParamsOpeningParen.range[1]);
        const { body } = node;
        if (body.type === 'BlockStatement')
        {
            const { loc } = body;
            if (loc.start.line === outerCalleeFirstLine && loc.end.line === outerCalleeLastLine)
                validJunctionSet.add(body.range[0]);
        }
        let tokenBeforeCallExpr;
        let tokenAfterCallExpr;
        if
        (
            (tokenBeforeCallExpr = sourceCode.getTokenBefore(callExpr)) &&
            isOpeningParenToken(tokenBeforeCallExpr) &&
            isTokenOnSameLine(tokenBeforeCallExpr, callExpr) &&
            (tokenAfterCallExpr = sourceCode.getTokenAfter(callExpr)) &&
            isClosingParenToken(tokenAfterCallExpr) &&
            isTokenOnSameLine(callExpr, tokenAfterCallExpr)
        )
        {
            validJunctionSet.add(tokenBeforeCallExpr.range[1]);
            validJunctionSet.add(callExpr.range[0]);
            validJunctionSet.add(callExpr.range[1]);
            validJunctionSet.add(tokenAfterCallExpr.range[0]);
        }
    }

    function validateProgramExit()
    {
        for (const [openingBracket, closingBracket] of bracketPairsIn(sourceCode))
            validateBracketPair(openingBracket, closingBracket);
    }

    const validJunctionSet = new Set();
    const { sourceCode } = context;
    const ruleListeners =
    {
        'CallExpression>ArrowFunctionExpression.callee':    validateIIFE,
        'CallExpression>FunctionExpression.callee':         validateIIFE,
        'Program:exit':                                     validateProgramExit,
    };
    return ruleListeners;
}

module.exports = { meta, create };
