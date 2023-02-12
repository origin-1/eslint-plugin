
# `property-colon-spacing`

The rule `property-colon-spacing` enforces consistent spacing around the colon of key-value
properties in object literals and object patterns.

The rule requires that a property has no spaces before the colon if it is pre-adjustable, and that
is has a consistent, nonzero number of spaces after the colon if it is post-adjustable.

A property is considered pre-adjustable if the colon and the first token or comment before the colon
share a line of code, and it is post-adjustable if the colon and the first token or comment after
the colon share a line of code.

If a property is post-adjustable, the rule requires exactly one space after the colon if one of the
following criteria is true:
* The property shares a line of code with another property in the same object.
* The first token or comment after the colon does not start on the same line of code where the
  property starts.
* It is the only post-adjustable property in the object that does not meet the two criteria above.

Other post-adjustable properties that do not meet these criteria will be aligned by the rule such
that the first tokens or comments after the colons start at the same column.

Only key-value properties are validated.
Shortcut properties, spread properties, accessor and method definitions are not validated.

## Examples

### Examples of **incorrect** code for this rule

```js
/* eslint @origin-1/property-colon-spacing: "error" */
/* eslint-env es2017 */

var obj1 = { foo : bar };

var obj2 = { foo:bar };

var { foo:  bar } = obj3;

method
(
    {
        foo: bar,
        bar:  foo,
    },
);
```

### Examples of **correct** code for this rule

```js
/* eslint @origin-1/property-colon-spacing: "error" */
/* eslint-env es2020 */

var obj1 = { foo: 1, [bar]: 2, 'baz': 3 };

var obj2 =
{
    foo: 1,
    shortcut,
};

var obj3 =
{
    foo:     1,
     [bar]:  2,
    'baz':   3,
    [
        'multiline key'
    ]: 4,
    'value on next line':
        5,
    shortcut,
    get accessor()
    { },
    set accessor(value)
    { },
    method()
    { },
    ...spread,
};

(
    {
        foo:   bar,
        baz,
        [bar]: foo = 42,
    }
) => _;
```

## Superseded core ESLint rules

* [`key-spacing`](https://eslint.org/docs/latest/rules/key-spacing)
