import { describe, expect, it, vi } from "vitest";

import type { onOfficeSDKCache } from "../src/Cache/onOfficeSDKCache.js";
import { HttpFetchNoResultException } from "../src/Exception/HttpFetchNoResultException.js";
import { ApiCall } from "../src/internal/ApiCall.js";

class MockHttpFetch {
  constructor(private readonly body: string) {}
  async send(): Promise<string> {
    return this.body;
  }
}

describe("ApiCall", () => {
  it("returns handle from callByRawData", () => {
    const apiCall = new ApiCall();
    const result = apiCall.callByRawData(
      "someActionId",
      "someResourceId",
      "someIdentifier",
      "someResourceType",
      [],
    );
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("sends requests", async () => {
    const apiCall = new ApiCall();

    const id = apiCall.callByRawData(
      "someActionId",
      "someResourceId",
      "someIdentifier",
      "someResourceType",
      [],
    );

    await apiCall.sendRequests(
      "someToken",
      "someSecret",
      new MockHttpFetch(
        JSON.stringify({
          response: {
            results: {
              0: {
                status: {
                  errorcode: 0,
                },
                actionid: "someActionId",
                resourcetype: "someResourceType",
                data: {},
              },
            },
          },
        }),
      ) as any,
    );

    expect(apiCall.getResponse(id)).toBeDefined();
  });

  it("does not send if no queued requests", async () => {
    const apiCall = new ApiCall();
    const spy = vi.fn(async () => JSON.stringify({}));
    await apiCall.sendRequests("someToken", "someSecret", { send: spy } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it("throws on faulty response structure", async () => {
    const apiCall = new ApiCall();
    apiCall.callByRawData(
      "someActionId",
      "someResourceId",
      "someIdentifier",
      "someResourceType",
      [],
    );

    await expect(
      apiCall.sendRequests(
        "someToken",
        "someSecret",
        new MockHttpFetch(JSON.stringify({ response: {} })) as any,
      ),
    ).rejects.toBeInstanceOf(HttpFetchNoResultException);
  });

  it("supports adding and removing cache instances", () => {
    const cache: onOfficeSDKCache = {
      getHttpResponseByParameterArray: vi.fn(() => null),
      write: vi.fn(() => true),
      cleanup: vi.fn(),
      clearAll: vi.fn(),
    };

    const apiCall = new ApiCall();
    apiCall.addCache(cache);
    apiCall.removeCacheInstances();
    expect(apiCall.getErrors()).toEqual({});
  });
});
