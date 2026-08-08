'use strict';

const { makeRuleDocsURL } = require('../utils');

const KNOWN_PACKAGE_JSON_KEYS =
[
    'name',
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'contributors',
    'funding',
    'files',
    'exports',
    'main',
    'type',
    'browser',
    'bin',
    'man',
    'directories',
    'repository',
    'scripts',
    'gypfile',
    'config',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'bundleDependencies',
    'bundledDependencies',
    'optionalDependencies',
    'overrides',
    'packageExtensions',
    'engines',
    'os',
    'cpu',
    'libc',
    'devEngines',
    'private',
    'publishConfig',
    'workspaces',
];

const KNOWN_PACKAGE_JSON_KEYS_SET = new Set(KNOWN_PACKAGE_JSON_KEYS);

const meta =
{
    type:       'suggestion',
    docs:
    {
        description:
        'Enforce consistent field order and disallow duplicate fields in package.json files',
        url: makeRuleDocsURL('package-json-fields'),
    },
    schema:     [],
    messages:
    {
        expectedAfter:
        'Field "{{field}}" should come after "{{prev}}".',
        expectedBefore:
        'Field "{{field}}" should come before "{{next}}".',
        expectedBetween:
        'Field "{{field}}" should come after "{{prev}}" and before "{{next}}".',
        expectedObject:
        'Expected a JSON object at the root of the document.',
        uselessRedefined:
        'Field "{{field}}" is redefined later and this definition is unused.',
    },
    languages:  ['json/json'],
};

function create(context)
{
    function validatePackageJson({ body })
    {
        if (body.type !== 'Object')
        {
            context.report({ node: body, messageId: 'expectedObject' });
            return;
        }
        const { members } = body;
        const actualKeyIndexMap = new Map();
        members.forEach
        (
            (member, index) =>
            {
                const key = member.name.value;
                const indices = actualKeyIndexMap.get(key);
                if (indices)
                    indices.last = index;
                else
                    actualKeyIndexMap.set(key, { first: index, last: index });
            },
        );
        const knownKeys = KNOWN_PACKAGE_JSON_KEYS.filter(key => actualKeyIndexMap.has(key));
        const unknownKeys =
        Array.from(actualKeyIndexMap.keys())
        .filter(key => !KNOWN_PACKAGE_JSON_KEYS_SET.has(key))
        .sort();
        const expectedKeys = [...knownKeys, ...unknownKeys];
        const orderMap = new Map();
        expectedKeys.forEach
        (
            (key, index) =>
            {
                const prev = expectedKeys[index - 1];
                const next = expectedKeys[index + 1];
                orderMap.set(key, { prev, next });
            },
        );
        members.forEach
        (
            ({ name }, index) =>
            {
                const key = name.value;
                if (index < actualKeyIndexMap.get(key).last)
                {
                    context.report
                    ({ node: name, messageId: 'uselessRedefined', data: { field: key } });
                    return;
                }
                const { prev, next } = orderMap.get(key);
                const reportPrev = prev && actualKeyIndexMap.get(prev).first > index;
                const reportNext = next && actualKeyIndexMap.get(next).last < index;
                if (reportPrev && reportNext)
                {
                    context.report
                    (
                        {
                            node:       name,
                            messageId:  'expectedBetween',
                            data:       { field: key, prev, next },
                        },
                    );
                }
                else if (reportPrev)
                {
                    context.report
                    ({ node: name, messageId: 'expectedAfter', data: { field: key, prev } });
                }
                else if (reportNext)
                {
                    context.report
                    ({ node: name, messageId: 'expectedBefore', data: { field: key, next } });
                }
            },
        );
    }

    const ruleListeners = { Document: validatePackageJson };
    return ruleListeners;
}

module.exports = { meta, create };
