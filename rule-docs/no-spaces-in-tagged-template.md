# `no-spaces-in-tagged-template`

The rule `no-spaces-in-tagged-template` disallows spaces in tagged template expressions while still
allowing line breaks and comments.

In order to disallow spaces before the template literal of a tagged template expression, ESLint
provides the rule
[`template-tag-spacing`](https://eslint.org/docs/latest/rules/template-tag-spacing) with the default
option `"never"`.
Unfortunately, this setting also disallows line breaks and spaces around comments when they appear
before the template literal.

The Origin₁ rule `no-spaces-in-tagged-template` disallows spaces in tagged template expressions
while still allowing line breaks and comments.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/no-spaces-in-tagged-tamplate: "error" */

fn ``;
```

### ✅ Correct

```js
/* eslint @origin-1/no-spaces-in-tagged-tamplate: "error" */

fn``;

fn
`foo
${bar}
baz`;

fn /* spaces around comments are fine */ ();

fn // this is fine, too
``;
```

## Superseded core ESLint rules

* [`template-tag-spacing`](https://eslint.org/docs/latest/rules/template-tag-spacing)
