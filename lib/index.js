'use strict';

const { readdirSync }               = require('node:fs');
const { basename, extname, join }   = require('node:path');

const rules = this.rules = { };
const rulesDir = join(__dirname, 'rules');
const fileNames = readdirSync(rulesDir);
for (const fileName of fileNames)
{
    if (extname(fileName) === '.js')
    {
        const ruleName = basename(fileName, '.js');
        const ruleDirPath = join(rulesDir, fileName);
        const rule = require(ruleDirPath);
        rules[ruleName] = rule;
    }
}
