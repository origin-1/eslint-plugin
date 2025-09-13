# `nice-space-before-function-paren`

The rule `nice-space-before-function-paren` enforces consistent spacing before the opening
parenthesis in a function definition.

This is similar to using the predefined rule
[`space-before-function-paren`](https://eslint.org/docs/latest/rules/space-before-function-paren)
with settings `["error", { anonymous: "always", named: "never", asyncArrow: "always" }]`.
The main difference lies in the way line breaks are treated.
While the predefined rule `space-before-function-paren` considers line breaks as regular spacing
characters, and disallows them before the opening parenthesis in a regular named function
definition, the Origin₁ rule `nice-space-before-function-paren` always allows newlines, also when
they are surrounded by regular whitespaces.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/nice-space-before-function-paren: "error" */

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

### ✅ Correct

```js
/* eslint @origin-1/nice-space-before-function-paren: "error" */

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

## Superseded core ESLint rules

* [`space-before-function-paren`](https://eslint.org/docs/latest/rules/space-before-function-paren)
