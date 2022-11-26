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
        "@origin-1/no-spaces-in-call-expression": "error",
        "@origin-1/property-colon-spacing": "error"
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

### `property-colon-spacing`

#### Rule Details

The rule `property-colon-spacing` enforces consistent spacing around the colon of key-value
properties in object literals.

The rule requires that a property has no spaces before the colon if it is pre-adjustable, and that
is has a consistent, nonzero number of spaces after the colon if it is post-adjustable.

A property is considered pre-adjustable if the colon and the first token or comment before the colon
share a line of code, and it is post-adjustable if the colon and the first token or comment after
the colon share a line of code.

If a property is post-adjustable, the rule requires exactly one space after the colon if one of the
following criteria is true:
* The property shares a line of code with another property in the same object.
* The first token or comment after the colon does not start on the same line of code where the
  property starts.
* It is the only post-adjustable property in the object that does not meet the two criteria above.

Other post-adjustable properties that do not meet these criteria will be aligned by the rule such
that the first tokens or comments after the colons start at the same column.

Only key-value properties are validated.
Shortcut properties, spread properties, accessor and method definitions are not validated.

Examples of **incorrect** code for this rule:

```js
/* eslint @origin-1/property-colon-spacing: "error" */
/* eslint-env es2018 */

var obj1 = { foo : bar };

var obj2 = { foo:bar };

var obj3 = { foo:  bar };

method
(
    {
        foo: bar,
        bar:  foo,
    },
);

```

Examples of **correct** code for this rule:

```js
/* eslint @origin-1/property-colon-spacing: "error" */
/* eslint-env es2018 */

var obj1 = { foo: 1, [bar]: 2, 'baz': 3 };

var obj2 =
{
    foo: 1,
    shortcut,
};

var obj3 =
{
    foo:     1,
     [bar]:  2,
    'baz':   3,
    [
        'multiline key'
    ]: 4,
    'value on next line':
        5,
    shortcut,
    get accessor()
    { },
    set accessor(value)
    { },
    method()
    { },
    ...spread,
};
```

[npm badge]: https://badge.fury.io/js/@origin-1%2Feslint-plugin.svg
[npm url]: https://www.npmjs.com/package/@origin-1/eslint-plugin
