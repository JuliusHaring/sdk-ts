import crypto from "node:crypto";
import { ApiAction } from "./ApiAction.js";

export class Request {
  private static requestIdStatic = 0;

  private readonly requestId: number;
  private readonly apiAction: ApiAction;

  constructor(apiAction: ApiAction) {
    this.apiAction = apiAction;
    this.requestId = Request.requestIdStatic++;
  }

  createRequest(token: string, secret: string): Record<string, unknown> {
    const actionParameters = { ...this.apiAction.getActionParameters() } as Record<string, unknown>;

    if (actionParameters.timestamp === null || actionParameters.timestamp === undefined) {
      actionParameters.timestamp = Math.floor(Date.now() / 1000);
    }

    actionParameters.hmac_version = 2;

    const actionId = String(actionParameters.actionid ?? "");
    const type = String(actionParameters.resourcetype ?? "");

    actionParameters.hmac = this.createHmac2(
      token,
      secret,
      String(actionParameters.timestamp),
      type,
      actionId,
    );

    return actionParameters;
  }

  private createHmac2(
    token: string,
    secret: string,
    timestamp: string,
    type: string,
    actionId: string,
  ): string {
    const payload = `${timestamp}${token}${type}${actionId}`;
    return crypto.createHmac("sha256", secret).update(payload).digest("base64");
  }

  getRequestId(): number {
    return this.requestId;
  }

  getApiAction(): ApiAction {
    return this.apiAction;
  }
}
