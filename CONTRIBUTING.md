# Contributing

## Bootstrap Repository

```
pnpm i
pnpm run build
```

## Development

This will trigger watch mode for `tsup` and automatically rebuild if a change is detected. Testing changes can be done in one of the provided examples.

```
pnpm run dev
```

## Examples

To test package changes or play with the examples you can run the following command:

```
pnpm --filter="<example package.json name>" run dev
```

Additionally, you can test the production output of every example via:

```
pnpm --filter="<example package.json name>" run build
pnpm --filter="<example package.json name>" run start
```

## Versioning / Changelog

We use [atlassian/changesets](https://github.com/atlassian/changesets) to version and publish our packages as well as automatically generate the changelogs. The final step of a pull request should be to generate a changeset file via:

```
pnpm run changeset
```

From there you can follow along the prompts. Reminder that this project utilizes [semver](https://semver.org/).

