'use strict';

const { bracketPairsIn, isColonToken, isTokenOnSameLine, makeRuleDocsURL } = require('../utils');

const INDENT_UNIT = 4;

function getActualIndent(sourceLine)
{
    const [{ length: indent }] = /^\s*/.exec(sourceLine);
    return indent;
}

function isOpeningBraceToken(token)
{
    const returnValue = token.type === 'Punctuator' && token.value === '{';
    return returnValue;
}

function isTemplateToken(token)
{
    const returnValue = token?.type === 'Template';
    return returnValue;
}

const meta =
{
    type:           'layout',
    docs:
    {
        description:    'Enforce consistent indentation',
        url:            makeRuleDocsURL('indent'),
    },
    fixable:        'whitespace',
    schema:
    [
        {
            type:           'integer',
            description:    'Expected indentation of the first line of code, in units of 4 spaces',
        },
    ],
    defaultOptions: [0],
    messages:
    {
        indent:
        'Expected indentation of {{expected}} character(s) but found {{actual}}.',
        indentBlockComment:     'Add {{missing}} indentation space(s) to this block comment.',
        unindentBlockComment:   'Remove {{extra}} indentation space(s) from this block comment.',
    },
};

function create(context)
{
    function expectIndents(firstLine, lastLine, indent = INDENT_UNIT)
    {
        for (let line = firstLine; line <= lastLine; ++line)
            expectedIndents[line] += indent;
    }

    function findLeadingNodeOrComment(node)
    {
        const nodeOrComments = sourceCode.getCommentsBefore(node);
        nodeOrComments.push(node);
        const leadingNodeOrComment = nodeOrComments.find(isFirstTokenOrCommentInLine);
        return leadingNodeOrComment;
    }

    function isFirstTokenOrCommentInLine(tokenOrComment)
    {
        const tokenOrCommentBefore =
        sourceCode.getTokenBefore(tokenOrComment, { includeComments: true });
        const returnValue =
        !tokenOrCommentBefore || !isTokenOnSameLine(tokenOrCommentBefore, tokenOrComment);
        return returnValue;
    }

    function isLastTokenInLine(token)
    {
        const tokenAfter = sourceCode.getTokenAfter(token);
        const returnValue = !tokenAfter || !isTokenOnSameLine(token, tokenAfter);
        return returnValue;
    }

    function reportBlockComment(shifts, comment, diffIndent, isLeadingComment)
    {
        const commentLoc = comment.loc;
        const commentStart = commentLoc.start;
        const startLine = commentStart.line;
        const start = isLeadingComment ? { line: startLine, column: 0 } : commentStart;
        const { end } = commentLoc;
        const loc = { start, end };
        const firstLine = isLeadingComment ? startLine : startLine + 1;
        const lastLine = end.line;
        if (diffIndent > 0)
        {
            context.report
            (
                {
                    loc,
                    messageId:  'unindentBlockComment',
                    data:       { extra: diffIndent },
                    * fix()
                    {
                        for (let line = firstLine; line <= lastLine; ++line)
                        {
                            const sourceLine = sourceLines[line - 1];
                            const actualIndent = getActualIndent(sourceLine);
                            const startIndex = sourceCode.getIndexFromLoc({ line, column: 0 });
                            const shift = Math.min(diffIndent, actualIndent);
                            const endIndex = startIndex + shift;
                            const range = [startIndex, endIndex];
                            const fix = { range, text: '' };
                            yield fix;
                            shifts[line] = shift;
                        }
                    },
                },
            );
        }
        else
        {
            const missingIndent = -diffIndent;
            context.report
            (
                {
                    loc,
                    messageId:  'indentBlockComment',
                    data:       { missing: missingIndent },
                    * fix()
                    {
                        const text = ' '.repeat(missingIndent);
                        for (let line = firstLine; line <= lastLine; ++line)
                        {
                            const index = sourceCode.getIndexFromLoc({ line, column: 0 });
                            const range = [index, index];
                            const fix = { range, text };
                            yield fix;
                            shifts[line] = diffIndent;
                        }
                    },
                },
            );
        }
    }

    function reportLine(shifts, line, actualIndent, expectedIndent)
    {
        const startLoc = { line, column: 0 };
        const endLoc = { line, column: actualIndent };
        context.report
        (
            {
                messageId:  'indent',
                data:       { actual: actualIndent, expected: expectedIndent },
                loc:        { start: startLoc, end: endLoc },
                fix(fixer)
                {
                    const startIndex = sourceCode.getIndexFromLoc(startLoc);
                    const endIndex = startIndex + actualIndent;
                    const range = [startIndex, endIndex];
                    const newText = ' '.repeat(expectedIndent);
                    const fix = fixer.replaceTextRange(range, newText);
                    return fix;
                },
            },
        );
        shifts[line] = actualIndent - expectedIndent;
    }

    function unexpectIndents(firstLine, lastLine)
    {
        for (let line = firstLine; line <= lastLine; ++line)
            delete expectedIndents[line];
    }

    function validateClause(node)
    {
        if (node.type !== 'BlockStatement')
        {
            const leadingNodeOrComment = findLeadingNodeOrComment(node);
            if (leadingNodeOrComment)
                expectIndents(leadingNodeOrComment.loc.start.line, node.loc.end.line);
        }
    }

    function validateProgramExit(node)
    {
        const shifts = [];
        const multilineComments = [];
        for (const [openingBracket, closingBracket] of bracketPairsIn(sourceCode))
        {
            if (isLastTokenInLine(openingBracket))
            {
                const firstLine = openingBracket.loc.end.line + 1;
                const lastTokenOrCommentInBracket =
                sourceCode.getTokenBefore(closingBracket, { includeComments: true });
                const lastLine = lastTokenOrCommentInBracket.loc.end.line;
                expectIndents(firstLine, lastLine);
            }
        }
        {
            const templateTokens = sourceCode.getFirstTokens(node, { filter: isTemplateToken });
            for (const { loc } of templateTokens)
            {
                const firstLine = loc.start.line + 1;
                const lastLine = loc.end.line;
                unexpectIndents(firstLine, lastLine);
            }
        }
        {
            const comments = sourceCode.getAllComments();
            for (const comment of comments)
            {
                const { loc } = comment;
                const startLine = loc.start.line;
                const endLine = loc.end.line;
                if (startLine < endLine)
                {
                    multilineComments[startLine] = comment;
                    unexpectIndents(startLine + 1, endLine);
                }
            }
        }
        for (let line = 1; line <= lineCount; ++line)
        {
            let expectedIndent = expectedIndents[line];
            const comment = multilineComments[line];
            const isLeadingComment = comment && isFirstTokenOrCommentInLine(comment);
            if (expectedIndent != null)
            {
                if (expectedIndent < 0)
                    expectedIndent = 0;
                const sourceLine = sourceLines[line - 1];
                const actualIndent = getActualIndent(sourceLine);
                const shift = actualIndent - expectedIndent;
                if (shift && actualIndent !== sourceLine.length)
                {
                    const comment = multilineComments[line];
                    if (isLeadingComment)
                        reportBlockComment(shifts, comment, shift, true);
                    else
                        reportLine(shifts, line, actualIndent, expectedIndent);
                }
            }
            if (comment && !isLeadingComment)
            {
                const diffIndent = shifts[line];
                if (diffIndent)
                    reportBlockComment(shifts, comment, diffIndent, false);
            }
        }
    }

    function validateSwitchStatement(node)
    {
        const openingBrace =
        sourceCode.getTokenAfter(node.discriminant, { filter: isOpeningBraceToken });
        if (isLastTokenInLine(openingBrace))
        {
            for (const switchCase of node.cases)
            {
                const leadingNodeOrComment = findLeadingNodeOrComment(switchCase);
                if (leadingNodeOrComment)
                {
                    const colon =
                    sourceCode.getTokenAfter
                    (
                        switchCase.test ??
                        sourceCode.getFirstToken(switchCase), { filter: isColonToken },
                    );
                    expectIndents
                    (leadingNodeOrComment.loc.start.line, colon.loc.end.line, -INDENT_UNIT);
                }
            }
        }
    }

    const [initialIndentUnits] = context.options;
    const { sourceCode } = context;
    const sourceLines = sourceCode.getLines();
    const lineCount = sourceLines.length;
    const expectedIndents = Array(lineCount + 1).fill(initialIndentUnits * INDENT_UNIT, 1);
    const ruleListeners =
    {
        'DoWhileStatement>.body':   validateClause,
        'ForStatement>.body':       validateClause,
        'ForInStatement>.body':     validateClause,
        'ForOfStatement>.body':     validateClause,
        'IfStatement>.alternate':   validateClause,
        'IfStatement>.consequent':  validateClause,
        'WhileStatement>.body':     validateClause,
        'WithStatement>.body':      validateClause,
        'SwitchStatement':          validateSwitchStatement,
        'Program:exit':             validateProgramExit,
    };
    return ruleListeners;
}

module.exports = { meta, create };
