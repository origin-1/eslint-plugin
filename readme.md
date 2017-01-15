# `eslint-plugin-no-spaces-in-call-expression`

[ESLint](http://eslint.org) plugin to disallow spaces after the left side of a call or new
expression.

In order to disallow spaces between a function name (or an expression evaluating to a function) and
the parentheses that invoke it, ESLint offers the rule
[`func-call-spacing`](http://eslint.org/docs/rules/func-call-spacing) with the option `"never"`.
Anyway, this setting also disallows newlines and spaces around comments when they are found between
a function name and the left parenthesis.

`eslint-plugin-no-spaces-in-call-expression` provides the rule `no-spaces-in-call-expression` to
disallow spaces in call or new expressions while still allowing newlines and comments.
This rule was designed as a replacement for the [JSCS](http://jscs.info) rule
[`disallowSpacesInCallExpression`](http://jscs.info/rule/disallowSpacesInCallExpression) which has a
similar functionality.

## Installation

Install ESLint and `eslint-plugin-no-spaces-in-call-expression`:

```
$ npm i --save-dev eslint eslint-plugin-no-spaces-in-call-expression
```

### Note

If you installed ESLint globally (using the `-g` flag) then you must also install plugins globally:

```
$ npm i -g eslint-plugin-no-spaces-in-call-expression
```

## Usage

Add `"no-spaces-in-call-expression"` to the plugins section of your `.eslintrc` configuration file.
You can omit the `eslint-plugin-` prefix.
Then configure the `no-spaces-in-call-expression` rule under the `"rules"` section.

```json
{
    "plugins": [
        "no-spaces-in-call-expression"
    ],
    "rules": {
        "no-spaces-in-call-expression/no-spaces-in-call-expression": "error"
    }
}
```

## Rule Details

The rule `no-spaces-in-call-expression` disallows spaces in call or new expressions while still
allowing newlines and comments.

Examples of **incorrect** code for this rule:

```js
/* eslint no-spaces-in-call-expression/no-spaces-in-call-expression: "error" */

fn ();
```

Examples of **correct** code for this rule:

```js
/* eslint no-spaces-in-call-expression/no-spaces-in-call-expression: "error" */

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

## Further Reading

* [ESLint Issue #7587](https://github.com/eslint/eslint/issues/7587)
