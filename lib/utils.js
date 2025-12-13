'use strict';

const BRACKET_SET = new Set('()>[]{}');

/**
 * Returns a new iterator that yields all bracket pair tokens in the source code.
 * The recognized bracket pairs are `(…)`, `[…]`, `{…}` and where applicable `<…>`.
 * The returned iterator yields a sequence of arrays where the first element is the opening bracket
 * token and the second element is the closing bracket token.
 * The bracket pairs are reported in the order of their closing brackets.
 * @param {SourceCode} sourceCode
 * @returns {Iterator<[Token, Token]>}
 * A new iterator that yields all bracket pair tokens in the source code.
 */
function * bracketPairsIn(sourceCode)
{
    const tokens = sourceCode.getFirstTokens(sourceCode.ast, { filter: isBracketToken });
    const stack = [];
    for (const token of tokens)
    {
        switch (token.value)
        {
        case '(':
        case '[':
        case '{':
            stack.push(token);
            break;
        case '>':
            {
                const node = sourceCode.getNodeByRangeIndex(token.range[0]);
                const { type } = node;
                if
                (type !== 'TSTypeParameterDeclaration' && type !== 'TSTypeParameterInstantiation')
                    break;
                const openingBracket = sourceCode.getFirstToken(node);
                const closingBracket = token;
                const yieldValue = [openingBracket, closingBracket];
                yield yieldValue;
            }
            break;
        case ')':
        case ']':
        case '}':
            {
                const openingBracket = stack.pop();
                const closingBracket = token;
                const yieldValue = [openingBracket, closingBracket];
                yield yieldValue;
            }
            break;
        }
    }
}

/**
 * Determines whether a specified token is any of the brackets `(`, `)`, `>`, `[`, `]`, `{` or `}`.
 * (note that `<` is not considered).
 * @param {Token} token The token object to check.
 * @returns {boolean}
 * Whether or not the token is any of the brackets `(`, `)`, `>`, `[`, `]`, `{` or `}`.
 */
function isBracketToken(token)
{
    const returnValue = token.type === 'Punctuator' && BRACKET_SET.has(token.value);
    return returnValue;
}

/**
 * Determines whether a specified token is a closing parenthesis token.
 * @param {Token} token The token to check.
 * @returns {boolean} Whether or not the token is a closing parenthesis token.
 */
function isClosingParenToken(token)
{
    const returnValue = token.value === ')' && token.type === 'Punctuator';
    return returnValue;
}

/**
 * Determines whether a specified token is a colon token.
 * @param {Token} token The token object to check.
 * @returns {boolean} Whether or not the token is a colon token.
 */
function isColonToken(token)
{
    return token.value === ':' && token.type === 'Punctuator';
}

/**
 * Determines whether a specified token is an opening parenthesis token.
 * @param {Token} token - The token to check.
 * @returns {boolean} Whether or not the token is an opening parenthesis token.
 */
function isOpeningParenToken(token)
{
    const returnValue = token.value === '(' && token.type === 'Punctuator';
    return returnValue;
}

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {Token} firstToken The first token object.
 * @param {Token} lastToken The last token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 */
function isTokenOnSameLine(firstToken, lastToken)
{
    const returnValue = firstToken.loc.end.line === lastToken.loc.start.line;
    return returnValue;
}

/**
 * Creates the documentation URL for a specified rule.
 * @param {string} ruleName The unprefixed name of a rule.
 * @returns {string} The documentation URL for the rule.
 */
function makeRuleDocsURL(ruleName)
{
    const url = `https://github.com/origin-1/eslint-plugin/blob/main/rule-docs/${ruleName}.md`;
    return url;
}

/**
 * Reports a problem if there is only white space between two tokens or between the first token and
 * the end of the line, whichever is shorter.
 * @param {Token} firstToken The first token object.
 * @param {Token} lastToken The last token object.
 * @param {RuleContext} context The ESLint rule context object.
 * @param {ASTNode} [node] The node to be reported.
 * @param {Object.<string, string>} [data] Data to format the message.
 * @returns {void}
 */
function reportOnSpace(firstToken, lastToken, context, node, data)
{
    const [, separatorStart] = firstToken.range;
    const [separatorEnd] = lastToken.range;
    const { sourceCode } = context;
    const sourceText = sourceCode.getText();
    const separator = sourceText.slice(separatorStart, separatorEnd);
    const match = /^(?:(?=.)\s)+(?!.)/.exec(separator);
    if (match)
    {
        const start = firstToken.loc.end;
        const { line, column } = start;
        const [{ length }] = match;
        const end = { line, column: column + length };
        const rangeToRemove = [separatorStart, separatorStart + length];
        const report =
        {
            node,
            loc:        { start, end },
            messageId:  'unexpectedSpace',
            data,
            fix:        fixer => fixer.removeRange(rangeToRemove),
        };
        context.report(report);
    }
}

module.exports =
{
    bracketPairsIn,
    isClosingParenToken,
    isColonToken,
    isOpeningParenToken,
    isTokenOnSameLine,
    makeRuleDocsURL,
    reportOnSpace,
};
