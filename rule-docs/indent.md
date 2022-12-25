# `indent`

The rule `indent` enforces the indentation style used in Origin₁ JavaScript and TypeScript files.

The indentation rules in order of lowest to highest priority are as follows:
* Lines between any of the bracket pairs `(…)`, `[…]`, `{…}` and `<…>` are indented 4 spaces more
than the line with the opening bracket.
* Clauses of the statements `do…while`, `for`, `if`/`else`, `while` and `with` are indented 4
spaces more than the controlling statement, even when they are not enclosed in braces.
* In the body of a switch statement, `case` and `default` labels have the same indentation as the
line with the opening brace.
* In a multiline template, expressions are indented like regular code, but lines that start with
string texts are ignored.
* Empty lines are ignored.
* In a multiline comment, each line is indented or unindented the same number of spaces as the first
line.

This rule supersedes the predefined rule [`indent`](https://eslint.org/docs/latest/rules/indent).

## Examples of **incorrect** code for this rule

```js
/* eslint @origin-1/indent: "error" */
/* eslint-env es6 */

const foo =
bar
(
  baz
);

if (foo)
bar();

switch (foo) {
    case 0:
    bar(baz);
    break;
  default:
    bar();
    break;
}

const foobaz = `${
    /* Your comment here. */
    foo + baz
}`;
```

## Examples of **correct** code for this rule

```js
/* eslint @origin-1/indent: "error" */
/* eslint-env es6 */

const foo =
bar
(
    baz
);

if (foo)
    bar();

switch (foo) {
case 0:
    bar(baz);
    break;
default:
    bar();
    break;
}

const foobaz = `${
/* Your comment here. */
foo + baz
}`;
```
