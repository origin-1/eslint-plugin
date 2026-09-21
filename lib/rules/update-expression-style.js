'use strict';

const { makeRuleDocsURL } = require('../utils');

/**
 * Determines whether a token would be attached to a preceding identifier or expression if the two
 * were separated only by white space, as `(`, `[` and template literal tokens would.
 * @param {Token} token The token object to check.
 * @returns {boolean} Whether or not the token would be attached to a preceding expression.
 */
function isAttachingToken(token)
{
    const returnValue =
    token.type === 'Template' ||
    token.type === 'Punctuator' && (token.value === '(' || token.value === '[');
    return returnValue;
}

/**
 * Determines whether the value of an expression is discarded, i.e. never used.
 * This is the case for expression statements, for the initialization and update expressions of a
 * `for` statement, for the operand of the `void` operator, and for all but the last expression in a
 * sequence expression.
 * The last expression in a sequence expression is discarded only if the value of the sequence
 * expression itself is discarded.
 * @param {ASTNode} node The expression node to check.
 * @returns {boolean} Whether or not the value of the expression is discarded.
 */
function isValueDiscarded(node)
{
    for (;;)
    {
        const { parent } = node;
        switch (parent.type)
        {
        case 'ExpressionStatement':
            return true;
        case 'ForStatement':
            return parent.init === node || parent.update === node;
        case 'SequenceExpression':
            if (parent.expressions.at(-1) !== node)
                return true;
            node = parent;
            break;
        case 'UnaryExpression':
            return parent.operator === 'void';
        default:
            return false;
        }
    }
}

const meta =
{
    type:           'suggestion',
    docs:
    {
        description:
        'Enforce consistent usage of prefix or postfix increment and decrement operators when ' +
        'the value of the expression is not used',
        url: makeRuleDocsURL('update-expression-style'),
    },
    fixable:        'code',
    schema:
    [
        {
            enum:           ['prefix', 'postfix'],
            description:    'Whether to use prefix or postfix increment and decrement operators',
        },
    ],
    defaultOptions: ['postfix'],
    messages:
    {
        expectedPrefix:     'Expected prefix operator "{{operator}}".',
        expectedPostfix:    'Expected postfix operator "{{operator}}".',
    },
    languages:      ['js/*'],
};

function create(context)
{
    /**
     * Creates a fix that moves the operator of a prefix update expression after its operand.
     * @param {ASTNode} node The update expression node.
     * @param {Token} operatorToken The operator token.
     * @returns {Function|null} The fix function, or `null` if the problem cannot be fixed safely.
     */
    function getFixToPostfix(node, operatorToken)
    {
        const operandFirstToken = sourceCode.getTokenAfter(operatorToken);
        if (sourceCode.commentsExistBetween(operatorToken, operandFirstToken))
            return null;
        // A postfix operator must be on the same line as its operand, so line breaks and other
        // white space between the operator and the operand are dropped.
        const operandText =
        sourceCode.text.slice(operatorToken.range[1], node.range[1]).trimStart();
        const fix = fixer => fixer.replaceText(node, operandText + operatorToken.value);
        return fix;
    }

    /**
     * Creates a fix that moves the operator of a postfix update expression before its operand.
     * @param {ASTNode} node The update expression node.
     * @param {Token} operatorToken The operator token.
     * @returns {Function|null} The fix function, or `null` if the problem cannot be fixed safely.
     */
    function getFixToPrefix(node, operatorToken)
    {
        const operandLastToken = sourceCode.getTokenBefore(operatorToken);
        if (sourceCode.commentsExistBetween(operandLastToken, operatorToken))
            return null;
        const nextToken = sourceCode.getTokenAfter(node);
        if (nextToken && isAttachingToken(nextToken))
            return null;
        const operandText = sourceCode.text.slice(node.range[0], operatorToken.range[0]).trimEnd();
        const fix = fixer => fixer.replaceText(node, operatorToken.value + operandText);
        return fix;
    }

    function validateUpdateExpression(node)
    {
        if (node.prefix === expectedPrefix || !isValueDiscarded(node))
            return;
        let operatorToken;
        let messageId;
        let fix;
        if (expectedPrefix)
        {
            operatorToken = sourceCode.getLastToken(node);
            messageId = 'expectedPrefix';
            fix = getFixToPrefix(node, operatorToken);
        }
        else
        {
            operatorToken = sourceCode.getFirstToken(node);
            messageId = 'expectedPostfix';
            fix = getFixToPostfix(node, operatorToken);
        }
        const report =
        { loc: operatorToken.loc, messageId, data: { operator: operatorToken.value }, fix };
        context.report(report);
    }

    const { sourceCode } = context;
    const [style] = context.options;
    const expectedPrefix = style === 'prefix';
    const ruleListeners = { UpdateExpression: validateUpdateExpression };
    return ruleListeners;
}

module.exports = { meta, create };
