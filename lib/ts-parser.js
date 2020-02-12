'use strict';

function deleteGlobalTSHelpers()
{
    const KEYS =
    [
        '__assign',
        '__asyncDelegator',
        '__asyncGenerator',
        '__asyncValues',
        '__await',
        '__awaiter',
        '__decorate',
        '__exportStar',
        '__extends',
        '__generator',
        '__importDefault',
        '__importStar',
        '__makeTemplateObject',
        '__metadata',
        '__param',
        '__read',
        '__rest',
        '__spread',
        '__spreadArrays',
        '__values',
    ];
    for (const key of KEYS)
        delete global[key];
}

const parser = require('@typescript-eslint/parser');
const { parseForESLint } = parser;
parser.parseForESLint =
function (...args)
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
};
module.exports = parser;
