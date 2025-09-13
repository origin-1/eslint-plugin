# `no-leading-binary-operator`

Enforces that binary and ternary operators are not placed at the beginning of a line.

This rule helps improve code readability by ensuring that operators accepting two or more operands
(such as `+`, `*`, `<`, `&&`, `||`, `=`, `?`…`:`, etc.) are positioned at the end of the previous
line rather than the start of a new line.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/no-leading-binary-operator: "error" */

const sum =
    a
    + b;
```

### ✅ Correct

```js
/* eslint @origin-1/no-leading-binary-operator: "error" */

const sum =
    a +
    b;
```

### ✅ Correct (operator alone on its own line is allowed)

```js
/* eslint @origin-1/no-leading-binary-operator: "error" */

const sum =
    a
    +
    b;
 ```

## Superseded core ESLint rules

* [`operator-linebreak`](https://eslint.org/docs/latest/rules/operator-linebreak)
