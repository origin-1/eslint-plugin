'use strict';

const { makeRuleDocsURL } = require('../utils');

const CONSTRUCTOR_NAMES =
[
    'AggregateError',
    'Array',
    'Error',
    'EvalError',
    'Function',
    'Object',
    'RangeError',
    'ReferenceError',
    'RegExp',
    'SyntaxError',
    'TypeError',
    'URIError',
];

const meta =
{
    type:       'suggestion',
    docs:
    {
        description:    'Disallow unnecessary usages of the new syntax',
        url:            makeRuleDocsURL('no-extra-new'),
    },
    schema:     [],
    messages:   { unexpected: 'Unnecessary usage of the new syntax.' },
};

function create(context)
{
    const { sourceCode } = context;
    const ruleListeners =
    {
        'Program:exit':
        node =>
        {
            const globalScope = sourceCode.getScope(node);
            for (const constructorName of CONSTRUCTOR_NAMES)
            {
                const variable = globalScope.set.get(constructorName);
                if (variable && variable.defs.length === 0)
                {
                    for (const ref of variable.references)
                    {
                        const idNode = ref.identifier;
                        const { parent } = idNode;
                        if (parent && parent.type === 'NewExpression' && parent.callee === idNode)
                            context.report({ node: parent, messageId: 'unexpected' });
                    }
                }
            }
        },
    };
    return ruleListeners;
}

module.exports = { meta, create };
