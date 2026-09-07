/* global describe:readonly it:readonly */

'use strict';

const assert                        = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { basename, extname, join }   = require('node:path');
const plugin                        = require('../..');
const { default: json }             = require('@eslint/json');
const tsParser                      = require('@typescript-eslint/parser');
const { Linter }                    = require('eslint');

const CORRECT_MARK      = '✅';
const INCORRECT_MARK    = '❌';
const MARKS             = [CORRECT_MARK, INCORRECT_MARK];

const FENCE_REGEXP      = /^ {0,3}(?<backticks>`{3,})[ \t]*(?<info>[^`]*?)[ \t]*$/;
const HEADING_REGEXP    = /^ {0,3}#{1,6}[ \t]/;

const LANGUAGE_SETTINGS =
{
    __proto__:  null,
    js:         { language: '@/js', scanHeading: scanJSTSHeading },
    json:       { language: 'json/json' },
    ts:
    { language: '@/js', languageOptions: { parser: tsParser }, scanHeading: scanJSTSHeading },
};

const PLUGINS = { '@origin-1': plugin, json };

const SNIPPET_TEST_ACTIONS =
{
    [CORRECT_MARK]:     'reports no problem in',
    [INCORRECT_MARK]:   'reports a problem in',
};

const linter = new Linter();

function describeCodeBlock(fileName, ruleId, codeBlock)
{
    const { expectation, language } = codeBlock;
    describe
    (
        `${language} code block at line ${codeBlock.startLine - 1}`,
        () =>
        {
            const snippets = findSnippets(codeBlock);
            const langSettings = LANGUAGE_SETTINGS[language];
            const info =
            { expectation, fileName, headingLines: [], headingStartLine: 0, langSettings, ruleId };
            const { scanHeading } = langSettings;
            scanHeading?.(info, snippets);
            for (const snippet of snippets)
            {
                const action = SNIPPET_TEST_ACTIONS[expectation] ?? 'parses';
                it
                (
                    `${action} the snippet at line ${snippet.startLine}`,
                    () => testSnippet(info, snippet),
                );
            }
        },
    );
}

function describeRuleDoc(ruleDocsDirPath, fileName)
{
    describe
    (
        fileName,
        function ()
        {
            if (this.isPending())
                return;
            const ruleId = `@origin-1/${basename(fileName, '.md')}`;
            const text = readFileSync(join(ruleDocsDirPath, fileName), 'utf8');
            for (const codeBlock of findCodeBlocks(text))
            {
                if (codeBlock.language in LANGUAGE_SETTINGS)
                    describeCodeBlock(fileName, ruleId, codeBlock);
            }
        },
    );
}

// Finds the fenced code blocks in a Markdown text, along with the line where their contents start
// and the ✅ or ❌ mark of the innermost heading above them, if any.
function findCodeBlocks(text)
{
    const codeBlocks = [];
    let codeBlock = null;
    let heading;
    const lines = text.split('\n');
    for (const [index, line] of lines.entries())
    {
        const match = FENCE_REGEXP.exec(line);
        if (!codeBlock)
        {
            if (match)
            {
                const { backticks, info } = match.groups;
                const expectation = findExpectation(heading);
                codeBlock =
                { backticks, expectation, language: info, lines: [], startLine: index + 2 };
            }
            else if (HEADING_REGEXP.test(line))
                heading = line;
        }
        else if (isClosingFence(match, codeBlock))
        {
            codeBlocks.push(codeBlock);
            codeBlock = null;
        }
        else
            codeBlock.lines.push(line);
    }
    return codeBlocks;
}

// Returns the ✅ or ❌ mark found in a Markdown heading, if any.
function findExpectation(heading)
{
    const expectation = MARKS.find(mark => heading?.includes(mark));
    return expectation;
}

// A snippet that contains only comments is the heading comment of its code block.
// The rules it configures are found by linting it with no plugins available: ESLint then reports
// one problem per configured rule, complaining that the rule definition was not found.
function findHeadingJSTSRuleIds(snippet, langSettings)
{
    const messages = verifySnippet(snippet.lines, langSettings);
    if (messages.some(({ fatal }) => fatal))
        return undefined;
    const { ast } = linter.getSourceCode();
    if (ast.body.length > 0 || ast.comments.length === 0)
        return undefined;
    const ruleIds = messages.map(({ ruleId }) => ruleId);
    return ruleIds;
}

function findSnippets(codeBlock)
{
    const snippets = [];
    let snippet = null;
    for (const [index, line] of codeBlock.lines.entries())
    {
        if (/^\s*$/.test(line))
            snippet = null;
        else
        {
            if (!snippet)
            {
                snippet = { lines: [], startLine: codeBlock.startLine + index };
                snippets.push(snippet);
            }
            snippet.lines.push(line);
        }
    }
    return snippets;
}

// A correct snippet must be problem-free, an incorrect one may only be reported by the rule it
// illustrates, and a snippet outside the examples must only be parsable.
function findUnexpectedMessages(messages, expectation, ruleId)
{
    if (expectation === INCORRECT_MARK)
        return messages.filter(message => message.ruleId !== ruleId);
    return messages;
}

function formatMessage(info, snippet, { column, line, message, ruleId })
{
    const actualLine = getActualLine(info, snippet, line);
    const prefix = ruleId == null ? '' : `${ruleId}: `;
    const returnValue = `${prefix}${message} (${info.fileName}:${actualLine}:${column})`;
    return returnValue;
}

// Maps a line in a linted snippet back to the line of the documentation file it comes from.
function getActualLine(info, snippet, line)
{
    const { headingLines: { length: headingLinesLength }, headingStartLine } = info;
    const actualLine =
    line - 1 +
    (line <= headingLinesLength ? headingStartLine : snippet.startLine - headingLinesLength);
    return actualLine;
}

function isClosingFence(match, codeBlock)
{
    const returnValue =
    match != null && !match.groups.info &&
    match.groups.backticks.length >= codeBlock.backticks.length;
    return returnValue;
}

function scanJSTSHeading(info, snippets)
{
    const { expectation, langSettings, ruleId } = info;
    const [firstSnippet] = snippets;
    let headingRuleIds = [];
    const ruleIds = firstSnippet ? findHeadingJSTSRuleIds(firstSnippet, langSettings) : undefined;
    if (ruleIds)
    {
        snippets.shift();
        info.headingLines.push(...firstSnippet.lines, '');
        info.headingStartLine = firstSnippet.startLine;
        headingRuleIds = ruleIds;
    }
    if (expectation != null)
        it(`configures rule ${ruleId}`, () => assert.deepEqual(headingRuleIds, [ruleId]));
}

function testSnippet(info, snippet)
{
    const { expectation, headingLines, langSettings, ruleId } = info;
    const lines = [...headingLines, ...snippet.lines];
    const rules = info.headingLines.length || !expectation ? { } : { [ruleId]: 'error' };
    const messages = verifySnippet(lines, langSettings, PLUGINS, rules);
    const unexpectedMessages = findUnexpectedMessages(messages, expectation, ruleId);
    if (unexpectedMessages.length > 0)
    {
        const formattedMessages =
        unexpectedMessages.map(message => formatMessage(info, snippet, message));
        assert.fail(`Unexpected problems:\n${formattedMessages.join('\n')}`);
    }
    if (expectation === INCORRECT_MARK && messages.length === 0)
        assert.fail(`Expected a problem reported by rule ${ruleId}.`);
}

function verifySnippet(lines, langSettings, plugins = { }, rules = { })
{
    const code = lines.join('\n');
    const { language, languageOptions = { } } = langSettings;
    const config = { language, languageOptions, plugins, rules };
    const messages = linter.verify(code, config);
    return messages;
}

describe
(
    'Rule documentation',
    function ()
    {
        if (this.isPending())
            return;
        const ruleDocsDirPath = join(__dirname, '../../rule-docs');
        const fileNames = readdirSync(ruleDocsDirPath);
        for (const fileName of fileNames)
        {
            if (extname(fileName) === '.md')
                describeRuleDoc(ruleDocsDirPath, fileName);
        }
    },
);
