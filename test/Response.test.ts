import { describe, expect, it } from "vitest";

import { ApiAction } from "../src/internal/ApiAction.js";
import { Request } from "../src/internal/Request.js";
import { Response } from "../src/internal/Response.js";

describe("Response", () => {
  const request = new Request(new ApiAction("someActionId", "someResourceType", {}, "someResourceId", "someIdentifier"));

  it("is valid with required fields", () => {
    const response = new Response(request, {
      actionid: "someActionId",
      resourcetype: "someResourceType",
      data: "someData",
    });

    expect(response.isValid()).toBe(true);
  });

  it("is invalid without required fields", () => {
    const response = new Response(request, {});
    expect(response.isValid()).toBe(false);
  });

  it("is cacheable only with true cacheable flag and valid response", () => {
    const response = new Response(request, {
      actionid: "someActionId",
      resourcetype: "someResourceType",
      data: "someData",
      cacheable: true,
    });

    expect(response.isCacheable()).toBe(true);
  });

  it("is not cacheable when flag false", () => {
    const response = new Response(request, {
      actionid: "someActionId",
      resourcetype: "someResourceType",
      data: "someData",
      cacheable: false,
    });

    expect(response.isCacheable()).toBe(false);
  });

  it("returns request and response data", () => {
    const payload = {
      actionid: "someActionId",
      resourcetype: "someResourceType",
      data: "someData",
    };
    const response = new Response(request, payload);

    expect(response.getRequest()).toBe(request);
    expect(response.getResponseData()).toEqual(payload);
  });
});
