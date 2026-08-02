# `package-json-fields`

The rule `package-json-fields` enforces a consistent field order in `package.json` files and
disallows duplicate field definitions.

The rule uses a built-in list of known `package.json` fields.
Known fields are validated against a recommended order, while unknown fields are placed after known
fields in alphabetical order.
For known fields, the recommended order follows the npm
[package.json specification](https://docs.npmjs.com/cli/configuring-npm/package-json).

If a field is misplaced, the rule reports which fields should appear before or after it.
If the same field is defined more than once, earlier definitions are reported as unused because the
later definition is the one that takes effect.

## Configuration

To use this rule, set `language: "json/json"` and provide the `@eslint/json` language plugin in your
config.

## Examples

### ❌ Incorrect

```json
{
    "version": "1.0.0",
    "name": "some-package"
}
```

```json
{
    "name": "some-package",
    "version": "1.0.0",
    "version": "2.0.0"
}
```

### ✅ Correct

```json
{
    "name": "some-package",
    "version": "1.0.0",
    "description": "A sample package",
    "scripts": {
        "test": "node test.js"
    }
}
```
