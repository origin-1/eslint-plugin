
# `no-spaces-in-call-expression`

The rule `no-spaces-in-call-expression` disallows spaces in call or new expressions while still
allowing line breaks and comments.

In order to disallow spaces before the parentheses that invoke a call or new expression, ESLint
provides the rule [`func-call-spacing`](https://eslint.org/docs/latest/rules/func-call-spacing) with
the default option `"never"`.
Unfortunately, this setting also disallows line breaks and spaces around comments when they appear
before the left parenthesis.
It also disallows spaces and line breaks between the callee of an optional call expression and the
`?.` that follows.

The Origin₁ rule `no-spaces-in-call-expression` disallows spaces in call or new expressions while
still allowing line breaks and comments.
This rule was designed as a replacement for the [JSCS](https://jscs-dev.github.io/) rule
[`disallowSpacesInCallExpression`](https://jscs-dev.github.io/rule/disallowSpacesInCallExpression)
which provides similar functionality.

## Examples

### Examples of **incorrect** code for this rule

```js
/* eslint @origin-1/no-spaces-in-call-expression: "error" */

fn ();
```

### Examples of **correct** code for this rule

```js
/* eslint @origin-1/no-spaces-in-call-expression: "error" */

fn();

fn
('foo',
'bar',
'baz');

fn /* spaces around comments are fine */ ();

fn // this is fine, too
();

fn ?.(); // no spaces before parentheses
```

## Superseded core ESLint rules

* [`func-call-spacing`](https://eslint.org/docs/latest/rules/func-call-spacing)

## Further reading

* [ESLint Issue #7587](https://github.com/eslint/eslint/issues/7587)
