/* eslint-env mocha */

'use strict';

const { rules }             = require('../..');
const assert                = require('assert');
const { readdirSync }       = require('fs');
const { basename, join }    = require('path');

describe
(
    'The main file',
    () =>
    {
        const ruleDirPath = join(__dirname, '../../lib');
        const fileNames = readdirSync(ruleDirPath);
        fileNames.forEach
        (
            fileName =>
            {
                if (fileName !== 'index.js')
                {
                    const ruleName = basename(fileName, '.js');
                    it
                    (
                        `defines rule ${ruleName}`,
                        () =>
                        {
                            const rulePath = join(ruleDirPath, fileName);
                            const expectedRule = require(rulePath);
                            assert.strictEqual(rules[ruleName], expectedRule);
                        },
                    );
                }
            },
        );
    },
);
