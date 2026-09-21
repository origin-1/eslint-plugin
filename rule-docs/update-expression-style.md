# `update-expression-style`

The rule `update-expression-style` enforces consistent usage of prefix or postfix increment and
decrement operators in places where the choice between the two makes no difference.

The prefix form `++i` and the postfix form `i++` of an increment or decrement operator differ only
in the value of the expression: the prefix form evaluates to the new value of the operand, while the
postfix form evaluates to the old one.
When that value is not used, as in the update clause of a `for` loop or in an expression statement,
both forms have the same effect, and this rule enforces that only one of them is used.

Expressions whose value is used, like `x = i++` or `if (--count) …`, are never reported, because
changing their form would change the behavior of the code.

The value of an expression is considered unused when the expression is one of the following:
* An expression statement, like `i++;`.
* The initialization or update clause of a `for` statement, like `for (…; …; i++)`.
* The operand of the `void` operator, like `void i++`.
* Any but the last expression in a sequence expression, like `i++` in `x = (i++, j)`.
* The last expression in a sequence expression whose own value is unused, like `j++` in
`i++, j++;`.

## Options

This rule accepts a single string option:
* `"postfix"` (default) enforces the postfix form `i++` and `i--`.
* `"prefix"` enforces the prefix form `++i` and `--i`.

## Examples

### ❌ Incorrect with the default `"postfix"` option

```js
/* eslint @origin-1/update-expression-style: "error" */

++i;

for (let i = 0; i < n; ++i)
    foo(i);

--count, ++index;
```

### ✅ Correct with the default `"postfix"` option

```js
/* eslint @origin-1/update-expression-style: "error" */

i++;

for (let i = 0; i < n; i++)
    foo(i);

count--, index++;

const a = ++i; // The value of `++i` is used, so the prefix form is allowed.

while (--n) // The value of `--n` is used, so the prefix form is allowed.
    bar();
```

### ❌ Incorrect with the `"prefix"` option

```js
/* eslint @origin-1/update-expression-style: ["error", "prefix"] */

i++;

for (let i = 0; i < n; i++)
    foo(i);

count--, index++;
```

### ✅ Correct with the `"prefix"` option

```js
/* eslint @origin-1/update-expression-style: ["error", "prefix"] */

++i;

for (let i = 0; i < n; ++i)
    foo(i);

--count, ++index;

const a = i++; // The value of `i++` is used, so the postfix form is allowed.

while (n--) // The value of `n--` is used, so the postfix form is allowed.
    bar();
```
