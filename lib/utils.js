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
 * @private
 */
function isBracketToken(token)
{
    const returnValue = token?.type === 'Punctuator' && BRACKET_SET.has(token.value);
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
 * Determines whether two adjacent tokens are on the same line.
 * @param {Token} left The left token object.
 * @param {Token} right The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 */
function isTokenOnSameLine(left, right)
{
    const returnValue = left.loc.end.line === right.loc.start.line;
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

module.exports = { bracketPairsIn, isColonToken, isTokenOnSameLine, makeRuleDocsURL };
