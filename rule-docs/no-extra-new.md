# `no-extra-new`

The rule `no-extra-new` disallows unnecessary usages of the the `new` syntax.

The following built-in constructors can be called equally with or without `new` syntax:
* `AggregateError` (since ECMAScript 2021)
* `Array`
* `Error`
* `EvalError`
* `Function`
* `Object`
* `RangeError`
* `ReferenceError`
* `RegExp`
* `SyntaxError`
* `TypeError`
* `URIError`

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/no-extra-new: "error" */

var array = new Array(42);
var fn = new Function;
var obj = new Object('foo');
var regExp = new RegExp('\\d', 'g');
throw new TypeError();
```

### ✅ Correct

```js
/* eslint @origin-1/no-extra-new: "error" */

var array = Array(42);
var fn = Function();
var obj = Object('foo');
var regExp = RegExp('\\d', 'g');
throw TypeError();

function throwNew(Error)
{
    throw new Error(); // New expressions with a variable as callee are allowed.
}
```

## Superseded core ESLint rules

* [`no-new-object`](https://eslint.org/docs/latest/rules/no-new-object)
