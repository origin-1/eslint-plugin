# `@origin-1/eslint-plugin` · [![npm version][npm badge]][npm url]

[ESLint](https://eslint.org/) plugin for [Origin₁](https://github.com/origin-1) rules.

## Installation

Install ESLint and `@origin-1/eslint-plugin`:

```console
npm i --save-dev eslint @origin-1/eslint-plugin
```

### Note

If you installed ESLint globally (using the `-g` flag) then you must also install plugins globally:

```console
npm i -g @origin-1/eslint-plugin
```

## Usage

Add `"@origin-1"` to the `"plugins"` section of your `.eslintrc` configuration file.
Then configure the rules defined by this plugin under the `"rules"` section.

```json
{
    "plugins": [
        "@origin-1"
    ],
    "rules": {
        "@origin-1/bracket-layout": "error",
        "@origin-1/indent": "error",
        "@origin-1/nice-space-before-function-paren": "error",
        "@origin-1/no-extra-new": "error",
        "@origin-1/no-spaces-in-call-expression": "error",
        "@origin-1/no-spaces-in-tagged-template": "error",
        "@origin-1/property-colon-spacing": "error"
    }
}
```

## Rules

* [`bracket-layout`](rule-docs/bracket-layout.md)
* [`indent`](rule-docs/indent.md)
* [`nice-space-before-function-paren`](rule-docs/nice-space-before-function-paren.md)
* [`no-extra-new`](rule-docs/no-extra-new.md)
* [`no-spaces-in-call-expression`](rule-docs/no-spaces-in-call-expression.md)
* [`no-spaces-in-tagged-template`](rule-docs/no-spaces-in-tagged-template.md)
* [`property-colon-spacing`](rule-docs/property-colon-spacing.md)

[npm badge]: https://img.shields.io/npm/v/@origin-1%2Feslint-plugin?logo=npm
[npm url]: https://www.npmjs.com/package/@origin-1/eslint-plugin
