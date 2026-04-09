import crypto from "node:crypto";
import { serializeValue } from "../utils/phpSerialize.js";
import type { ActionParameters } from "../types.js";

export class ApiAction {
  private readonly actionParameters: ActionParameters;

  constructor(
    actionid: string,
    resourceType: string,
    parameters: Record<string, unknown> | unknown[],
    resourceId = "",
    identifier: string | null = "",
    timestamp: number | null = null,
  ) {
    const sortedParameters =
      Array.isArray(parameters)
        ? parameters
        : Object.keys(parameters)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
              acc[key] = parameters[key];
              return acc;
            }, {});

    this.actionParameters = {
      actionid,
      identifier,
      parameters: sortedParameters,
      resourceid: resourceId,
      resourcetype: resourceType,
      timestamp,
    };
  }

  getActionParameters(): ActionParameters {
    return this.actionParameters;
  }

  getIdentifier(): string {
    return crypto.createHash("md5").update(serializeValue(this.actionParameters)).digest("hex");
  }
}
