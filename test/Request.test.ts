import { describe, expect, it } from "vitest";

import { ApiAction } from "../src/internal/ApiAction.js";
import { Request } from "../src/internal/Request.js";

describe("Request", () => {
  it("returns api action", () => {
    const apiAction = new ApiAction(
      "someActionId",
      "someResourceType",
      {},
      "someResourceId",
      "someIdentifier",
    );
    const request = new Request(apiAction);

    expect(request.getApiAction()).toBe(apiAction);
  });

  it("creates request with explicit timestamp", () => {
    const secret = "yOJobbhGLXdp90XxvxedFhH7073L9U";
    const token = "mgjIQkNRnaqggVzy9cZW";

    const apiAction = new ApiAction(
      "urn:onoffice-de-ns:smart:2.5:smartml:action:get",
      "estateCategories",
      {},
      "someResourceId",
      "someIdentifier",
      123456789,
    );

    const request = new Request(apiAction);
    const result = request.createRequest(token, secret);

    expect(result.timestamp).toBe(123456789);
    expect(result.resourceid).toBe("someResourceId");
    expect(result.identifier).toBe("someIdentifier");
    expect(result.parameters).toEqual({});
    expect(result.actionid).toBe(
      "urn:onoffice-de-ns:smart:2.5:smartml:action:get",
    );
    expect(result.resourcetype).toBe("estateCategories");
    expect(result.hmac_version).toBeGreaterThanOrEqual(2);
    expect(result.hmac).toBe("dsvg3r4AFcQXges0MZ+3auzQVfnEB39pLkKSgmm9Wvg=");
  });

  it("creates request with auto timestamp", () => {
    const secret = "yOJobbhGLXdp90XxvxedFhH7073L9U";
    const token = "mgjIQkNRnaqggVzy9cZW";

    const apiAction = new ApiAction(
      "urn:onoffice-de-ns:smart:2.5:smartml:action:get",
      "estateCategories",
      {},
      "someResourceId",
      "someIdentifier",
    );

    const request = new Request(apiAction);
    const result = request.createRequest(token, secret);

    expect(Number(result.timestamp)).toBeGreaterThan(0);
    expect(result.hmac).toBeTruthy();
  });

  it("has incrementing request id", () => {
    const request = new Request(
      new ApiAction("someActionId", "someResourceType", {}),
    );
    expect(request.getRequestId()).toBeGreaterThanOrEqual(0);
  });
});
