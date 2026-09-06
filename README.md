# `@origin-1/eslint-plugin` · [![npm version][npm badge]][npm url]

[ESLint](https://eslint.org/) plugin for [Origin₁](https://github.com/origin-1) rules.

## Installation

Install ESLint and `@origin-1/eslint-plugin`.
To use JSON rules such as `@origin-1/package-json-fields`, also install `@eslint/json`:

```console
npm i --save-dev eslint @origin-1/eslint-plugin @eslint/json
```

## Usage

Add `"@origin-1"` to the `plugins` section of a configuration object in your ESLint configuration
file.
Then configure the rules defined by this plugin under the `rules` section.

```js
import json     from "@eslint/json";
import origin1  from "@origin-1/eslint-plugin";

export default
[
    {
        files:      ["**/*.{,c,m}[jt]s"],
        plugins:    { "@origin-1": origin1 },
        rules:
        {
            "@origin-1/bracket-layout":                     "error",
            "@origin-1/indent":                             "error",
            "@origin-1/multiline-node-layout":              "error",
            "@origin-1/nice-space-before-function-paren":   "error",
            "@origin-1/no-extra-new":                       "error",
            "@origin-1/no-leading-binary-operator":         "error",
            "@origin-1/no-spaces-in-call-expression":       "error",
            "@origin-1/no-spaces-in-tagged-template":       "error",
            "@origin-1/no-spaces-in-unary-expression":      "error",
            "@origin-1/property-colon-spacing":             "error",
            "@origin-1/property-shorthand":                 "error",
        },
    },
    {
        files:      ["**/package.json"],
        language:   "json/json",
        plugins:    { "@origin-1": origin1, json },
        rules:      { "@origin-1/package-json-fields": "error" },
    },
];
```

## Rules

* [`bracket-layout`](rule-docs/bracket-layout.md)
* [`indent`](rule-docs/indent.md)
* [`multiline-node-layout`](rule-docs/multiline-node-layout.md)
* [`nice-space-before-function-paren`](rule-docs/nice-space-before-function-paren.md)
* [`no-extra-new`](rule-docs/no-extra-new.md)
* [`no-leading-binary-operator`](rule-docs/no-leading-binary-operator.md)
* [`no-spaces-in-call-expression`](rule-docs/no-spaces-in-call-expression.md)
* [`no-spaces-in-tagged-template`](rule-docs/no-spaces-in-tagged-template.md)
* [`no-spaces-in-unary-expression`](rule-docs/no-spaces-in-unary-expression.md)
* [`package-json-fields`](rule-docs/package-json-fields.md)
* [`property-colon-spacing`](rule-docs/property-colon-spacing.md)
* [`property-shorthand`](rule-docs/property-shorthand.md)

[npm badge]: https://img.shields.io/npm/v/@origin-1%2Feslint-plugin?logo=npm
[npm url]: https://www.npmjs.com/package/@origin-1/eslint-plugin
