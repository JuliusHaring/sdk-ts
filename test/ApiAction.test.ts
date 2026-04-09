import { describe, expect, it } from "vitest";

import { ApiAction } from "../src/internal/ApiAction.js";

describe("ApiAction", () => {
  it("creates default action parameters", () => {
    const parameters = {
      param1: "value1",
      0: {
        param2: "value2",
        param3: "value3",
      },
    };

    const apiAction = new ApiAction(
      "someId",
      "someResource",
      parameters as unknown as Record<string, unknown>,
    );

    expect(apiAction.getActionParameters()).toEqual({
      actionid: "someId",
      identifier: "",
      parameters: {
        0: {
          param2: "value2",
          param3: "value3",
        },
        param1: "value1",
      },
      resourceid: "",
      resourcetype: "someResource",
      timestamp: null,
    });
  });

  it("creates deterministic identifier", () => {
    const parameters = {
      param1: "value1",
      0: {
        param2: "value2",
        param3: "value3",
      },
    };

    const apiAction = new ApiAction(
      "someId",
      "someResource",
      parameters as unknown as Record<string, unknown>,
    );

    expect(apiAction.getIdentifier()).toHaveLength(32);
  });

  it("creates custom action parameters", () => {
    const apiAction = new ApiAction(
      "someId",
      "someResource",
      { param1: "value1" },
      "someResourceId",
      "someIdentifier",
      123,
    );

    expect(apiAction.getActionParameters()).toEqual({
      actionid: "someId",
      identifier: "someIdentifier",
      parameters: { param1: "value1" },
      resourceid: "someResourceId",
      resourcetype: "someResource",
      timestamp: 123,
    });
  });
});
