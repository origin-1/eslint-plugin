
# `no-spaces-in-call-expression`

The rule `no-spaces-in-call-expression` disallows spaces in call or new expressions while still
allowing line breaks and comments.

In order to disallow spaces between a function name (or an expression evaluating to a function) and
the parentheses that invoke it, ESLint offers the rule
[`func-call-spacing`](https://eslint.org/docs/latest/rules/func-call-spacing) with the option
`"never"`.
Anyway, this setting also disallows line breaks and spaces around comments when they are found
between a function name and the left parenthesis.

`@origin-1/eslint-plugin` provides the rule `no-spaces-in-call-expression` to disallow spaces in
call or new expressions while still allowing line breaks and comments.
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
(
    'foo',
    'bar',
    'baz'
);

fn /* spaces around comments are fine */ ();

fn // this is fine, too
();
```

## Superseded core ESLint rules

* [`func-call-spacing`](https://eslint.org/docs/latest/rules/func-call-spacing)

## Further reading

* [ESLint Issue #7587](https://github.com/eslint/eslint/issues/7587)
