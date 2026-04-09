# onOffice SDK (TypeScript)

TypeScript client to communicate with the [onOffice API](https://apidoc.onoffice.de/).

## Project status

- TypeScript SDK is the primary implementation.
- Legacy PHP implementation has been preserved under `legacy/`.
- Migration behavior mapping is documented in `docs/mapping.md`.

## Install

```bash
npm install @onoffice/sdk
```

## Quickstart

```ts
import { onOfficeSDK } from "@onoffice/sdk";

const sdk = new onOfficeSDK();
sdk.setApiVersion("stable");

const handleReadEstate = sdk.callGeneric(onOfficeSDK.ACTION_ID_READ, "estate", {
  data: ["Id", "kaufpreis", "lage"],
  listlimit: 10,
  sortby: {
    kaufpreis: "ASC",
    warmmiete: "ASC",
  },
});

await sdk.sendRequests("put token here", "and secret here");

console.log(sdk.getResponseArray(handleReadEstate));
```

## Usage

### Client

`onOfficeSDK` creates and queues actions, sends batched requests, and maps responses back to handles.

### Request methods

- `callGeneric(actionId, resourceType, parameters)` for common requests
- `call(actionId, resourceId, identifier, resourceType, parameters)` for advanced requests

Use the returned handle with `getResponseArray(handle)`.

### Constants

The class exports action, module, and relation constants matching the legacy SDK.

### Caching

Use `addCache()` / `setCaches()` with implementations of `onOfficeSDKCache`.

## Legacy PHP code

Legacy code is preserved for reference and migration comparison:

- `legacy/src`
- `legacy/tests`
- `legacy/examples`
- `legacy/composer.json`

## Development

```bash
npm ci
npm run typecheck
npm run build
npm test
```

## Contributing

See `CONTRIBUTING.md`.

## License

MIT. See `LICENSE`.
