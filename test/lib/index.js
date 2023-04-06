/* eslint-env mocha */

'use strict';

const assert    = require('node:assert');
const { join }  = require('node:path');
const { rules } = require('../..');

describe
(
    'The main file',
    () =>
    {
        const ruleDirPath = join(__dirname, '../../lib/rules');
        for (const [ruleName, actualRule] of Object.entries(rules))
        {
            it
            (
                `defines rule ${ruleName}`,
                () =>
                {
                    const rulePath = join(ruleDirPath, `${ruleName}.js`);
                    const expectedRule = require(rulePath);
                    assert.strictEqual(actualRule, expectedRule);
                },
            );
        }
    },
);
