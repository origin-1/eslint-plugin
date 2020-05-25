'use strict';

const TSLIB_KEYS = Object.keys(require('tslib'));

function deleteGlobalTSHelpers()
{
    for (const key of TSLIB_KEYS)
        delete global[key];
}

const { parseForESLint } = require('@typescript-eslint/parser');
const parser =
{
    parseForESLint(...args)
    {
        try
        {
            const returnValue = parseForESLint.apply(this, args);
            return returnValue;
        }
        finally
        {
            deleteGlobalTSHelpers();
        }
    },
};
module.exports = parser;
