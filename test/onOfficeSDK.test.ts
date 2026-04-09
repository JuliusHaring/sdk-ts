import { describe, expect, it, vi } from "vitest";

import type { onOfficeSDKCache } from "../src/Cache/onOfficeSDKCache.js";
import { onOfficeSDK } from "../src/onOfficeSDK.js";

function createApiCallMock() {
  return {
    setServer: vi.fn(),
    setApiVersion: vi.fn(),
    setCurlOptions: vi.fn(),
    callByRawData: vi.fn(() => 1),
    sendRequests: vi.fn(async () => {}),
    getResponse: vi.fn(() => ["some", "response"]),
    addCache: vi.fn(),
    removeCacheInstances: vi.fn(),
    getErrors: vi.fn(() => ({})),
  } as any;
}

describe("onOfficeSDK", () => {
  it("sets default server on creation", () => {
    const apiCall = createApiCallMock();
    new onOfficeSDK(apiCall);
    expect(apiCall.setServer).toHaveBeenCalledWith("https://api.onoffice.de/api/");
  });

  it("forwards setApiVersion", () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);
    sdk.setApiVersion("v1");
    expect(apiCall.setApiVersion).toHaveBeenCalledWith("v1");
  });

  it("forwards setApiCurlOptions", () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);
    sdk.setApiCurlOptions(["some", "actions"]);
    expect(apiCall.setCurlOptions).toHaveBeenCalledWith(["some", "actions"]);
  });

  it("forwards callGeneric", () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);

    sdk.callGeneric("someActionId", "someResourceType", ["some", "parameters"]);

    expect(apiCall.callByRawData).toHaveBeenCalledWith(
      "someActionId",
      "",
      "",
      "someResourceType",
      ["some", "parameters"],
    );
  });

  it("forwards sendRequests", async () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);
    await sdk.sendRequests("someToken", "someSecret");
    expect(apiCall.sendRequests).toHaveBeenCalledWith("someToken", "someSecret");
  });

  it("returns response array", () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);
    expect(sdk.getResponseArray(1)).toEqual(["some", "response"]);
  });

  it("forwards cache operations", () => {
    const apiCall = createApiCallMock();
    const sdk = new onOfficeSDK(apiCall);

    const cache: onOfficeSDKCache = {
      getHttpResponseByParameterArray: () => null,
      write: () => true,
      cleanup: () => {},
      clearAll: () => {},
    };

    sdk.addCache(cache);
    sdk.removeCacheInstances();

    expect(apiCall.addCache).toHaveBeenCalledWith(cache);
    expect(apiCall.removeCacheInstances).toHaveBeenCalled();
  });
});
