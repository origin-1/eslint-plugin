# `multiline-node-layout`

The rule `multiline-node-layout` enforces that a node spanning multiple lines does not share a line
with unrelated code.

This rule inspects the punctuators `!=`, `!==`, `,`, `:`, `;`, `<`, `<=`, `==`, `===`, `=>`, `>`,
`>=` and `?` that separate a multiline node from the code around it, and forbids the following
placements:
* A punctuator followed in the same line by a multiline node that starts there.
* A punctuator preceded in the same line by a multiline node that ends there, when the punctuator is
not the last token in its line.
Only nodes that end immediately before a punctuator or start immediately after it are considered:
a node that merely encloses a punctuator, like the argument list around a `,` or the `for` statement
around a `;`, never makes that punctuator a problem, no matter how many lines it spans.
So a `,` in an argument list broken over several lines is reported only when the argument next to it
is itself a multiline node, like a destructured parameter written on multiple lines, and the same
holds for the `;`s in the head of a `for` statement.
Wrapping parentheses count as part of the node they enclose, so a parenthesized expression that
spans multiple lines is a multiline node even when the expression inside the parentheses fits in a
single line.

In effect, where one of the punctuators above separates a multiline node from the surrounding code,
the multiline node must be the first thing in the line where it starts, and the last thing in the
line where it ends, except for a trailing punctuator like `,` or `;`.

This rule is fixable: the fix inserts a line break after the offending punctuator.

## Examples

### ❌ Incorrect

```js
/* eslint @origin-1/multiline-node-layout: "error" */

foo = () => bar +
baz;

foo +
bar ? baz : qux;

test(
    {
        a,
    }, b,
);

for (let foo = 0; foo <
bar; foo++) { }

assert(foo === bar +
baz);

const foo = { bar: baz instanceof
qux };
```

### ✅ Correct

```js
/* eslint @origin-1/multiline-node-layout: "error" */

test(a, b + c);

test(
    a,
    b +
    c,
);

foo = () =>
bar +
baz;

foo =
bar;
baz = qux;

foo +
bar ?
baz : qux;

test(
    {
        a,
    },
    b,
);

for (
    let foo = 0;
    foo <
    bar;
    foo++
)
{ }
```

### ✅ Correct (a trailing punctuator after a multiline node is allowed)

```js
/* eslint @origin-1/multiline-node-layout: "error" */

[
    foo,
    bar +
    baz,
];

const foo =
{
    bar: baz,
};
```
