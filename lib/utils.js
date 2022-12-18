'use strict';

function isTokenOnSameLine(left, right)
{
    const returnValue = left.loc.end.line === right.loc.start.line;
    return returnValue;
}

module.exports = { isTokenOnSameLine };
