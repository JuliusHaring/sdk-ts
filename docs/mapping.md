# Legacy PHP to TypeScript Mapping

This document defines the 1:1 behavior mapping contract between the legacy PHP SDK and the TypeScript rewrite.

## Classes and modules

- `legacy/src/onOfficeSDK.php` -> `src/onOfficeSDK.ts`
- `legacy/src/internal/ApiAction.php` -> `src/internal/ApiAction.ts`
- `legacy/src/internal/ApiCall.php` -> `src/internal/ApiCall.ts`
- `legacy/src/internal/Request.php` -> `src/internal/Request.ts`
- `legacy/src/internal/Response.php` -> `src/internal/Response.ts`
- `legacy/src/internal/HttpFetch.php` -> `src/internal/HttpFetch.ts`
- `legacy/src/Cache/onOfficeSDKCache.php` -> `src/Cache/onOfficeSDKCache.ts`
- `legacy/src/Exception/SDKException.php` -> `src/Exception/SDKException.ts`
- `legacy/src/Exception/ApiCallFaultyResponseException.php` -> `src/Exception/ApiCallFaultyResponseException.ts`
- `legacy/src/Exception/ApiCallNoActionParametersException.php` -> `src/Exception/ApiCallNoActionParametersException.ts`
- `legacy/src/Exception/HttpFetchNoResultException.php` -> `src/Exception/HttpFetchNoResultException.ts`

## Behavioral parity checklist

- `onOfficeSDK` keeps the same action/relation/module constants.
- `onOfficeSDK` constructor configures default API server (`https://api.onoffice.de/api/`).
- `callGeneric()` delegates to `callByRawData(actionId, '', '', resourceType, parameters)`.
- `call()` delegates to `callByRawData(actionId, resourceId, identifier, resourceType, parameters)`.
- `sendRequests()` dispatches queued requests and populates response/error stores.
- `getResponseArray(handle)` returns payload for a successful request and removes it from response store.
- `Request.createRequest()` sets `timestamp` if missing, sets `hmac_version=2`, computes HMAC-SHA256 base64 digest.
- `Response.isValid()` requires `actionid`, `resourcetype`, and `data`.
- `Response.isCacheable()` requires valid response and `cacheable === true`.
- `ApiCall` cache behavior: read-before-send, write-only-cacheable-responses.
- `ApiCall` error behavior: non-zero `status.errorcode` is written to `getErrors()` map.
- `HttpFetch.send()` performs HTTP POST and throws `HttpFetchNoResultException` on missing result body.

## Intentional implementation differences

- Runtime is Node.js + TypeScript with async HTTP (`fetch`) instead of PHP cURL.
- Public behavior remains equivalent for request/response semantics, queue handling, and error/caching flow.
