'use strict';

const { isColonToken, isTokenOnSameLine, makeRuleDocsURL }  = require('../utils');
const GraphemeSplitter                                      = require('grapheme-splitter');

const splitter = new GraphemeSplitter();

/**
 * Finds the smallest value in a specified iterable object that does not subceed a specified
 * minimum.
 * @param {Iterable<number>} values An iterable object of numbers.
 * @param {number} minimum The minimum value.
 * @returns
 * The smallest value in the specified iterable object that does not subceed the specified minimum,
 * or `undefined` if no such value is found.
 */
function findSmallestValueNotBelow(values, minimum)
{
    let smallestValue;
    for (const value of values)
    {
        if (value < minimum || value >= smallestValue)
            continue;
        smallestValue = value;
    }
    return smallestValue;
}

/**
 * Determines if the given property is a key-value property.
 * @param {ASTNode} property Property node to check.
 * @returns {boolean} Whether the property is a key-value property.
 */
function isKeyValueProperty(property)
{
    const returnValue = !(property.method || property.shorthand || property.kind !== 'init');
    return returnValue;
}

const meta =
{
    type:       'layout',
    docs:
    {
        description:    'Enforce consistent spacing around the colon in object literal properties',
        url:            makeRuleDocsURL('property-colon-spacing'),
    },
    fixable:    'whitespace',
    schema:     [],
    messages:
    {
        extraSpaceAfterColon:   'Extra space after colon of {{computed}}property \'{{key}}\'.',
        extraSpaceBeforeColon:  'Extra space before colon of {{computed}}property \'{{key}}\'.',
        missingSpaceAfterColon: 'Missing space after colon of {{computed}}property \'{{key}}\'.',
    },
};

function create(context)
{
    /**
     * Returns the colon punctuator token for the colon of a key-value property.
     * @param {ASTNode} property The key-value property.
     * @returns {ASTNode} The colon punctuator.
     */
    function getColon(property)
    {
        return sourceCode.getFirstTokenBetween(property.key, property.value, isColonToken);
    }

    /**
     * Gets an object literal property's key as the identifier name or string value.
     * @param {ASTNode} property Property node whose key to retrieve.
     * @returns {string} The property's key.
     */
    function getKey(property)
    {
        const { key } = property;
        if (property.computed)
        {
            const { range } = key;
            return sourceText.slice(range[0], range[1]);
        }
        if (key.type === 'Identifier' && !property.computed)
            return key.name;
        return key.value;
    }

    /**
     * Gets a set of overlapping properties in a given sorted array.
     * @param {ASTNode[]} properties Properties in an object literal.
     * @returns {Set<ASTNode>} A set of overlapping properties.
     */
    function getOverlappingProperties(properties)
    {
        const overlappingProperties = new Set();
        let lastProperty = null;
        for (const currProperty of properties)
        {
            if (lastProperty && isTokenOnSameLine(lastProperty, currProperty))
            {
                overlappingProperties.add(lastProperty);
                overlappingProperties.add(currProperty);
            }
            lastProperty = currProperty;
        }
        return overlappingProperties;
    }

    /**
     * Returns a map of property nodes to the shift of their first tokens after the colon.
     * The shift is the number of graphemes that precede a token on the same line.
     * Properties that are explicitly excuded and those that do not start on the same line as their
     * first token after the colon will not be mapped.
     * If the returned `Map` object is not empty, it will have an additional property
     * `expectedShift` containing the shift that should be enforced by the rule for all first tokens
     * after the colon of the mapped properties.
     * @param {ASTNode[]} properties The properties to be mapped.
     * @param {Set<ASTNode>} excludedProperties A set of properties that should not be mapped.
     * @returns {Map<ASTNode, number> & { expectedShift?: number; }}
     * A map of property nodes to the shift of their first tokens after the colon, with an
     * additional property `expectedShift`.
     */
    function getShiftMap(properties, excludedProperties)
    {
        const shiftMap = new Map();
        let maxExpectedMinShift = 0;
        for (const property of properties)
        {
            if (excludedProperties.has(property))
                continue;
            const colon = getColon(property);
            const afterColon = getTokenOrCommentAfter(colon);
            const afterColonStart = afterColon.loc.start;
            if (property.loc.start.line === afterColonStart.line)
            {
                const { start: colonStart, end: colonEnd } = colon.loc;
                const colonShift =
                splitter.countGraphemes(sourceCode.getText(colon, colonStart.column));
                const actualSpace = afterColonStart.column - colonEnd.column;
                const actualShift = colonShift + actualSpace;
                const expectedMinShift = colonShift + 1;
                if (maxExpectedMinShift < expectedMinShift)
                    maxExpectedMinShift = expectedMinShift;
                shiftMap.set(property, actualShift);
            }
        }
        if (shiftMap.size > 1)
        {
            shiftMap.expectedShift =
            findSmallestValueNotBelow(shiftMap.values(), maxExpectedMinShift) ??
            maxExpectedMinShift;
        }
        else
            shiftMap.clear();
        return shiftMap;
    }

    /**
     * Gets the token or comment that follows a specified token.
     * @param {Token} token A token.
     * @returns {Token}
     * An object representing the token or comment that follows the specified token.
     */
    function getTokenOrCommentAfter(token)
    {
        const tokenAfter = sourceCode.getTokenAfter(token, { includeComments: true });
        return tokenAfter;
    }

    /**
     * Gets the token or comment that precedes a specified token.
     * @param {Token} token A token.
     * @returns {Token}
     * An object representing the token or comment that precedes the specified token.
     */
    function getTokenOrCommentBefore(token)
    {
        const tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });
        return tokenBefore;
    }

    /**
     * Reports an appropriately-formatted error if spacing is incorrect on one side of the
     * colon.
     * @param {ASTNode} property Key-value property in an object literal.
     * @param {Token} colon The colon punctuator.
     * @param {string} messageId The error message ID.
     * @param {ESTree.Position} start Start position of the problem.
     * @param {ESTree.Position} end End position of the problem.
     * @param {ReportFixer} fix The report fixer.
     * @returns {void}
     */
    function report(property, colon, messageId, start, end, fix)
    {
        context.report
        (
            {
                node:   colon,
                loc:    { start, end },
                messageId,
                data:
                {
                    computed: property.computed ? 'computed ' : '',
                    key:      getKey(property),
                },
                fix,
            },
        );
    }

    /**
     * Verifies spacing before and after colon in key-value properties.
     * @param {ASTNode} node ObjectExpression node being evaluated.
     * @returns {void}
     */
    function verifySpacing(node)
    {
        const { properties } = node;
        const keyValueProperties = properties.filter(isKeyValueProperty);
        const overlappingProperties = getOverlappingProperties(properties);
        const shiftMap = getShiftMap(keyValueProperties, overlappingProperties);
        const { expectedShift } = shiftMap;
        for (const property of keyValueProperties)
        {
            const colon = getColon(property);
            const beforeColon = getTokenOrCommentBefore(colon);
            const afterColon = getTokenOrCommentAfter(colon);
            const { start: colonStart, end: colonEnd } = colon.loc;
            const beforeColonEnd = beforeColon.loc.end;
            const afterColonStart = afterColon.loc.start;
            const spaceBeforeColon =
            colonStart.line === beforeColonEnd.line ?
            colonStart.column - beforeColonEnd.column : 0;
            if (spaceBeforeColon)
            {
                const fix = fixer => fixer.removeRange([beforeColon.range[1], colon.range[0]]);
                report(property, colon, 'extraSpaceBeforeColon', beforeColonEnd, colonStart, fix);
            }
            if (colonEnd.line === afterColonStart.line)
            {
                const actualShift = shiftMap.get(property);
                const missingSpace =
                actualShift != null ?
                expectedShift - actualShift + spaceBeforeColon :
                colonEnd.column + 1 - afterColonStart.column;
                if (missingSpace > 0)
                {
                    const fix = fixer => fixer.insertTextAfter(colon, ' '.repeat(missingSpace));
                    report
                    (property, colon, 'missingSpaceAfterColon', colonEnd, afterColonStart, fix);
                }
                else if (missingSpace < 0)
                {
                    const [endOffset] = afterColon.range;
                    const fix = fixer => fixer.removeRange([endOffset + missingSpace, endOffset]);
                    report(property, colon, 'extraSpaceAfterColon', colonEnd, afterColonStart, fix);
                }
            }
        }
    }

    const sourceCode = context.getSourceCode();
    const sourceText = sourceCode.getText();
    const ruleListeners = { ObjectExpression: verifySpacing };
    return ruleListeners;
}

module.exports = { meta, create };
