# `bracket-layout`

The rule `bracket-layout` enforces that a bracket whose counterpart appears on a different line is
not flanked by any other tokens in the same line.

More exactly, for any pair of brackets spanning multiple lines, this rule forbids any tokens
following the opening bracket in the same line, and any tokens preceding the closing bracket in
the same line.
Tokens preceding the opening bracket and tokens following the closing bracket are also forbidden,
unless they are syntactically bound to their containing node in a location where line breaks are not
permitted, for example after a `return` keyword or before a postfix `++` operator.
Some exceptions to this rule are granted to allow for the following constructs:
* The unary operators `!`, `+`, `++`, `-`, `--`, `^` and `~` before opening brackets.
* Rest/spread syntax `...` before opening brackets.
* Optional chaining operators `?.` before opening brackets.
* Almost all punctuators after closing brackets, with the exception of `.`, `?.` and brackets of any
kind.
Special relaxations to the rules above exist to permit compact IIFE style.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/bracket-layout: "error" */

foo(bar,
baz);

const a = [
];

while (true) {
    // ...
}

do
{
    ...
} while (condition);
```

### ✅ Correct

```js
/* eslint @origin-1/bracket-layout: "error" */
foo = [{ bar: (42 + baz) }];

foo =
[
    {
        bar:
        (
            42 +
            baz
        )
    }
];

throw (
    new Error
);

(function () {
    // Do something...
})();

!function () {
    // Do something else...
}();

(function () {
    // Do another thing...
}());
```

## Superseded core ESLint rules

* [`array-bracket-newline`](https://eslint.org/docs/latest/rules/array-bracket-newline)
* [`brace-style`](https://eslint.org/docs/latest/rules/brace-style)
