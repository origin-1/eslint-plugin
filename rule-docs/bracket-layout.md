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

This rule supersedes the predefined rules
[`array-bracket-newline`](https://eslint.org/docs/latest/rules/array-bracket-newline) and
[`brace-style`](https://eslint.org/docs/latest/rules/brace-style).

## Examples of **incorrect** code for this rule

```js
/* eslint @origin-1/bracket-layout: "error" */
/* eslint-env es6 */

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

## Examples of **correct** code for this rule

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
```
