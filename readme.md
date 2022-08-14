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

Add `"@origin-1"` to the plugins section of your `.eslintrc` configuration file.
Then configure the rules `nice-space-before-function-paren` and `no-spaces-in-call-expression` under
the `"rules"` section.

```json
{
    "plugins": [
        "@origin-1"
    ],
    "rules": {
        "@origin-1/nice-space-before-function-paren": "error",
        "@origin-1/no-spaces-in-call-expression": "error"
    }
}
```

## Rules

### `nice-space-before-function-paren`

#### Rule Details

The rule `nice-space-before-function-paren` enforces consistent spacing before the opening
parenthesis in a function definition.

This is similar to using the predefined rule
[`space-before-function-paren`](https://eslint.org/docs/rules/space-before-function-paren) with
settings `["error", { anonymous: "always", named: "never", asyncArrow: "always" }]`.
The main difference lies in the way line breaks are treated.
While the predefined rule `space-before-function-paren` considers line breaks as regular spacing
characters, and disallows them before the opening parenthesis in a regular named function
definition, the Origin₁ rule `nice-space-before-function-paren` always allows newlines, also when
they are surrounded by regular whitespaces.

Examples of **incorrect** code for this rule:

```js
/* eslint @origin-1/nice-space-before-function-paren: "error" */
/* eslint-env es6 */

function foo ()
{
    // ...
}

var bar =
function()
{
    // ...
};

class Foo
{
    constructor ()
    {
        // ...
    }
}

var foo =
{
    bar ()
    {
        // ...
    }
};

var foo = async(a) => await a
```

Examples of **correct** code for this rule:

```js
/* eslint @origin-1/nice-space-before-function-paren: "error" */
/* eslint-env es6 */

function foo(arg1, arg2)
{
    // ...
}

function foo2
(arg1, arg2)
{
    // ...
}

var bar =
function ()
{
    // ...
};

class Foo
{
    constructor()
    {
        // ...
    }
}

class Foo2
{
    constructor
    ()
    {
        // ...
    }
}

var foo =
{
    bar()
    {
        // ...
    }
};

var foo2 =
{
    bar
    ()
    {
        // ...
    }
};

var foo = async (a) => await a
```

### `no-spaces-in-call-expression`

#### Rule Details

The rule `no-spaces-in-call-expression` disallows spaces in call or new expressions while still
allowing line breaks and comments.

In order to disallow spaces between a function name (or an expression evaluating to a function) and
the parentheses that invoke it, ESLint offers the rule
[`func-call-spacing`](https://eslint.org/docs/rules/func-call-spacing) with the option `"never"`.
Anyway, this setting also disallows line breaks and spaces around comments when they are found
between a function name and the left parenthesis.

`@origin-1/eslint-plugin` provides the rule `no-spaces-in-call-expression` to disallow spaces
in call or new expressions while still allowing line breaks and comments.
This rule was designed as a replacement for the [JSCS](https://jscs-dev.github.io/) rule
[`disallowSpacesInCallExpression`](https://jscs-dev.github.io/rule/disallowSpacesInCallExpression)
which provides similar functionality.

Examples of **incorrect** code for this rule:

```js
/* eslint @origin-1/no-spaces-in-call-expression: "error" */

fn ();
```

Examples of **correct** code for this rule:

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

#### Further Reading

* [ESLint Issue #7587](https://github.com/eslint/eslint/issues/7587)

[npm badge]: https://badge.fury.io/js/@origin-1%2Feslint-plugin.svg
[npm url]: https://www.npmjs.com/package/@origin-1/eslint-plugin
