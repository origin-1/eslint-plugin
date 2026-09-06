'use strict';

const { isTokenOnSameLine, makeRuleDocsURL, reportOnSpace } = require('../utils');

const UNARY_OPERATORS = new Set(['!', '+', '-', '~']);

/**
 * Determines whether a specified token is a question mark token.
 * @param {Token} token The token object to check.
 * @returns {boolean} Whether or not the token is a question mark token.
 */
function isQuestionMarkToken(token)
{
    const returnValue = token.type === 'Punctuator' && token.value === '?';
    return returnValue;
}

/**
 * Determines whether removing the white space between two tokens would turn them into a different
 * sequence of tokens, like in `- -a` → `--a`.
 * Tokens on different lines are never joined, because only the white space up to the end of the
 * first line is removed.
 * @param {Token} firstToken The first token object.
 * @param {Token} lastToken The last token object.
 * @returns {boolean} Whether or not the tokens would be merged.
 */
function willMergeTokens(firstToken, lastToken)
{
    if (!isTokenOnSameLine(firstToken, lastToken))
        return false;
    const char = firstToken.value.slice(-1);
    const returnValue = (char === '+' || char === '-') && lastToken.value.startsWith(char);
    return returnValue;
}

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Disallow spaces between a unary operator and the expression it modifies',
        url:            makeRuleDocsURL('no-spaces-in-unary-expression'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    {
        unexpectedSpaceAfter:   'Unexpected space after operator "{{operator}}".',
        unexpectedSpaceBefore:  'Unexpected space before operator "{{operator}}".',
    },
    languages:  ['js/*'],
};

function create(context)
{
    function report(node, firstToken, lastToken, messageId, operator)
    {
        const fixable = !willMergeTokens(firstToken, lastToken);
        reportOnSpace
        (firstToken, lastToken, context, node, { messageId, data: { operator }, fixable });
    }

    function validateFirstToken(node)
    {
        validateSpaceAfter(node, sourceCode.getFirstToken(node));
    }

    function validateLastToken(node)
    {
        validateSpaceBefore(node, sourceCode.getLastToken(node));
    }

    function validateMappedType(node)
    {
        const { optional, readonly, typeAnnotation } = node;
        if (readonly === '+' || readonly === '-')
        {
            // The modifier is the token after the opening brace.
            const operatorToken = sourceCode.getFirstToken(node, { skip: 1 });
            validateSpaceAfter(node, operatorToken);
        }
        if (optional)
        {
            const nodeOrToken = typeAnnotation ?? sourceCode.getLastToken(node);
            const questionToken = sourceCode.getTokenBefore(nodeOrToken, isQuestionMarkToken);
            validateSpaceBefore(node, questionToken);
            if (optional === '+' || optional === '-')
            {
                const operatorToken = sourceCode.getTokenBefore(questionToken);
                validateSpaceBefore(node, operatorToken);
            }
        }
    }

    function validateSpaceAfter(node, operatorToken)
    {
        const nextToken = sourceCode.getTokenAfter(operatorToken);
        report(node, operatorToken, nextToken, 'unexpectedSpaceAfter', operatorToken.value);
    }

    function validateSpaceBefore(node, operatorToken)
    {
        const prevToken = sourceCode.getTokenBefore(operatorToken);
        report(node, prevToken, operatorToken, 'unexpectedSpaceBefore', operatorToken.value);
    }

    function validateUnaryExpression(node)
    {
        if (UNARY_OPERATORS.has(node.operator))
            validateFirstToken(node);
    }

    function validateUpdateExpression(node)
    {
        if (node.prefix)
            validateFirstToken(node);
        else
            validateLastToken(node);
    }

    const { sourceCode } = context;
    const ruleListeners =
    {
        RestElement:            validateFirstToken,
        SpreadElement:          validateFirstToken,
        TSMappedType:           validateMappedType,
        TSNonNullExpression:    validateLastToken,
        TSRestType:             validateFirstToken,
        UnaryExpression:        validateUnaryExpression,
        UpdateExpression:       validateUpdateExpression,
    };
    return ruleListeners;
}

module.exports = { meta, create };
