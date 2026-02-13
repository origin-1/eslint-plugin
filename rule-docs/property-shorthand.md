# `property-shorthand`

The rule `property-shorthand` enforces the shorthand syntax for properties in object literals.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/property-shorthand: "error" */

const foo = { bar: bar };
```

### ✅ Correct

```js
/* eslint @origin-1/property-shorthand: "error" */

const obj1 = { foo };

const obj2 = { foo /* comment */: foo };

const obj3 = { foo: /* comment */ foo };

const obj4 = { foo: (foo) };

const obj5 = { "foo": foo };
```

## Superseded core ESLint rules

* [`object-shorthand`](https://eslint.org/docs/latest/rules/object-shorthand) with option
`"properties"`
