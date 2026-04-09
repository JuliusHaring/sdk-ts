# Contributing

Please open an issue first for bug reports, feature requests, or behavior changes.

## Pull requests

- Keep PRs focused and small.
- Update docs when interface or behavior changes.
- Add or adjust unit tests for code changes.
- Ensure CI is green.

## Local setup

```bash
npm ci
```

## Running checks

```bash
npm run typecheck
npm run build
npm test
```

## Integration tests

The TypeScript rewrite currently runs unit tests in CI.
Integration tests are optional and local-only.

## Legacy PHP implementation

The old PHP SDK is archived in `legacy/` and not part of the active build/test pipeline.
