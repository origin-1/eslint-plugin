# `no-spaces-in-unary-expression`

The rule `no-spaces-in-unary-expression` disallows spaces between a unary operator and the
expression it modifies while still allowing line breaks and comments.

The operators considered by this rule are the unary punctuators `!`, `~`, `+`, `-`, `++` and `--`,
the spread and rest operator `...`, and, in TypeScript code, the non-null assertion operator `!` and
the modifiers `+`, `-` and `?` of a mapped type.

In order to disallow spaces after a unary operator, ESLint provides the rules
[`space-unary-ops`](https://eslint.org/docs/latest/rules/space-unary-ops) with the default option
`{ nonwords: false }` and
[`rest-spread-spacing`](https://eslint.org/docs/latest/rules/rest-spread-spacing) with the default
option `"never"`.
Unfortunately, these settings also disallow line breaks and spaces around comments between an
operator and the expression it modifies.

The Origin₁ rule `no-spaces-in-unary-expression` only disallows spaces that are not followed by a
line break, so an operator can still be the last token on its line.
Spaces before an operator that follows the expression it modifies, like the postfix `++` and `--`,
are disallowed, too.

Problems are not fixed automatically when removing the white space would change the way the code is
parsed, as in `- -a`, which would become `--a`.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/no-spaces-in-unary-expression: "error" */

a ++;

foo(... array);

! (a + b);
```

### ✅ Correct

```js
/* eslint @origin-1/no-spaces-in-unary-expression: "error" */

a++;

foo(...array);

!(a + b);

foo(... // `...` is the last token on this line
[1, 2, 3].map(fn));

- /* spaces around comments are fine */ a;

!
(a + b);
```

## Superseded core ESLint rules

* [`rest-spread-spacing`](https://eslint.org/docs/latest/rules/rest-spread-spacing)
* [`space-unary-ops`](https://eslint.org/docs/latest/rules/space-unary-ops)
