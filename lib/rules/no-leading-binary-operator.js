'use strict';

const { isTokenOnSameLine, makeRuleDocsURL } = require('../utils');

const meta =
{
    type:       'layout',
    docs:
    {
        description:
        'Disallow operators at the beginning of the line unless they are the only token',
        url:
        makeRuleDocsURL('no-leading-binary-operator'),
    },
    fixable:    'code',
    schema:     [],
    messages:
    { leadingOperator: 'Unexpected operator {{operator}} at the beginning of the line.' },
};

function create(context)
{
    function getFix(operatorToken, tokenBefore, tokenAfter)
    {
        const tokenOrCommentBefore = sourceCode.getTokenOrCommentBefore(operatorToken);
        if
        (
            tokenOrCommentBefore !== tokenBefore &&
            isTokenOnSameLine(tokenOrCommentBefore, operatorToken)
        )
            return null;
        const tokenOrCommentAfter = sourceCode.getTokenOrCommentAfter(operatorToken);
        if
        (
            tokenOrCommentAfter !== tokenAfter &&
            isTokenOnSameLine(operatorToken, tokenOrCommentAfter)
        )
            return null;
        const lineStart =
        sourceCode.getIndexFromLoc({ line: operatorToken.loc.start.line, column: 0 });
        const replacement = `\n${sourceCode.text.slice(lineStart, operatorToken.range[0])}`;
        const originalRange = [operatorToken.range[1], tokenAfter.range[0]];
        return fixer => fixer.replaceTextRange(originalRange, replacement);
    }

    function validateBinaryExpression(node)
    {
        validateNode(node.right, node.operator);
    }

    function validateConditionalExpression(trueNode, falseNode)
    {
        validateNode(trueNode, '?');
        validateNode(falseNode, ':');
    }

    function validateDefinition(rightNode)
    {
        validateNode(rightNode, '=');
    }

    function validateNode(rightNode, operator)
    {
        const operatorToken =
        sourceCode.getTokenBefore(rightNode, token => token.value === operator);
        const leftToken = sourceCode.getTokenBefore(operatorToken);
        if (isTokenOnSameLine(leftToken, operatorToken))
            return;
        const rightToken = sourceCode.getTokenAfter(operatorToken);
        if (!isTokenOnSameLine(operatorToken, rightToken))
            return;
        const fix = getFix(operatorToken, leftToken, rightToken);
        context.report
        (
            {
                node:       rightNode.parent,
                loc:        operatorToken.loc,
                messageId:  'leadingOperator',
                data:       { operator },
                fix,
            },
        );
    }

    const { sourceCode } = context;
    const ruleListeners =
    {
        'AccessorProperty > .value':                    validateDefinition,
        AssignmentExpression:                           validateBinaryExpression,
        'AssignmentPattern > .right':                   validateDefinition,
        BinaryExpression:                               validateBinaryExpression,
        ConditionalExpression:
        ({ consequent, alternate }) => validateConditionalExpression(consequent, alternate),
        LogicalExpression:                              validateBinaryExpression,
        'PropertyDefinition > .value':                  validateDefinition,
        TSConditionalType:
        ({ trueType, falseType }) => validateConditionalExpression(trueType, falseType),
        'TSEnumMember > .initializer':                  validateDefinition,
        'TSExportAssignment > .expression':             validateDefinition,
        'TSImportEqualsDeclaration > .moduleReference': validateDefinition,
        'TSTypeAliasDeclaration > .typeAnnotation':     validateDefinition,
        'TSTypeParameter > .default':                   validateDefinition,
        'VariableDeclarator > .init':                   validateDefinition,
    };
    return ruleListeners;
}

module.exports = { meta, create };
