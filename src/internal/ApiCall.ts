import type { onOfficeSDKCache } from "../Cache/onOfficeSDKCache.js";
import { ApiCallFaultyResponseException } from "../Exception/ApiCallFaultyResponseException.js";
import { HttpFetchNoResultException } from "../Exception/HttpFetchNoResultException.js";
import { ApiAction } from "./ApiAction.js";
import { HttpFetch } from "./HttpFetch.js";
import { Request } from "./Request.js";
import { Response } from "./Response.js";

export class ApiCall {
  private requestQueue: Record<number, Request> = {};
  private responses: Record<number, Response> = {};
  private errors: Record<number, Record<string, unknown>> = {};
  private apiVersion = "stable";
  private caches: onOfficeSDKCache[] = [];
  private server: string | null = null;
  private curlOptions: unknown = {};

  callByRawData(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: Record<string, unknown> | unknown[] = [],
  ): number {
    const apiAction = new ApiAction(actionId, resourceType, parameters, resourceId, identifier);
    const request = new Request(apiAction);
    const requestId = request.getRequestId();
    this.requestQueue[requestId] = request;
    return requestId;
  }

  async sendRequests(token: string, secret: string, httpFetch?: HttpFetch): Promise<void> {
    await this.collectOrGatherRequests(token, secret, httpFetch);
  }

  private async collectOrGatherRequests(token: string, secret: string, httpFetch?: HttpFetch): Promise<void> {
    const actionParameters: Record<string, unknown>[] = [];
    const actionParametersOrder: Request[] = [];

    for (const [requestIdRaw, request] of Object.entries(this.requestQueue)) {
      const requestId = Number(requestIdRaw);
      const usedParameters = request
        .getApiAction()
        .getActionParameters() as unknown as Record<string, unknown>;
      const cachedResponse = this.getFromCache(usedParameters);

      if (cachedResponse === null) {
        actionParameters.push(request.createRequest(token, secret));
        actionParametersOrder.push(request);
      } else {
        this.responses[requestId] = new Response(request, cachedResponse);
      }
    }

    await this.sendHttpRequests(token, actionParameters, actionParametersOrder, httpFetch);
    this.requestQueue = {};
  }

  private async sendHttpRequests(
    token: string,
    actionParameters: Record<string, unknown>[],
    actionParametersOrder: Request[],
    httpFetch?: HttpFetch,
  ): Promise<void> {
    if (actionParameters.length === 0) {
      return;
    }

    const responseHttp = await this.getFromHttp(token, actionParameters, httpFetch);

    let result: Record<string, any>;
    try {
      result = JSON.parse(responseHttp);
    } catch {
      throw new HttpFetchNoResultException("Invalid JSON response");
    }

    if (!result?.response?.results) {
      throw new HttpFetchNoResultException();
    }

    const idsForCache: number[] = [];

    for (const [requestNumber, resultHttp] of Object.entries(result.response.results as Record<string, any>)) {
      const request = actionParametersOrder[Number(requestNumber)];
      const requestId = request.getRequestId();

      if (resultHttp?.status?.errorcode === 0) {
        this.responses[requestId] = new Response(request, resultHttp as Record<string, unknown>);
        idsForCache.push(requestId);
      } else {
        this.errors[requestId] = resultHttp as Record<string, unknown>;
      }
    }

    this.writeCacheForResponses(idsForCache);
  }

  private writeCacheForResponses(responseIds: number[]): void {
    if (this.caches.length === 0) {
      return;
    }

    const responseObjects = Object.entries(this.responses)
      .filter(([requestId]) => responseIds.includes(Number(requestId)))
      .map(([, response]) => response);

    for (const response of responseObjects) {
      if (response.isCacheable()) {
        const responseData = response.getResponseData();
        const requestParameters = response.getRequest().getApiAction().getActionParameters();
        this.writeCache(
          JSON.stringify(responseData),
          requestParameters as unknown as Record<string, unknown>,
        );
      }
    }
  }

  private getFromCache(parameters: Record<string, unknown>): Record<string, unknown> | null {
    for (const cache of this.caches) {
      const resultCache = cache.getHttpResponseByParameterArray(parameters);
      if (resultCache !== null) {
        try {
          return JSON.parse(resultCache) as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }

    return null;
  }

  private writeCache(result: string, actionParameters: Record<string, unknown>): void {
    for (const cache of this.caches) {
      cache.write(actionParameters, result);
    }
  }

  setCurlOptions(curlOptions: unknown): void {
    this.curlOptions = curlOptions;
  }

  private async getFromHttp(
    token: string,
    actionParameters: Record<string, unknown>[],
    httpFetch?: HttpFetch,
  ): Promise<string> {
    const request = {
      token,
      request: { actions: actionParameters },
    };

    const instance =
      httpFetch ??
      (() => {
        const created = new HttpFetch(this.getApiUrl(), JSON.stringify(request));
        created.setCurlOptions(this.curlOptions);
        return created;
      })();

    return await instance.send();
  }

  getResponse(handle: number): Record<string, unknown> | undefined {
    if (Object.prototype.hasOwnProperty.call(this.responses, handle)) {
      const response = this.responses[handle];
      if (!response.isValid()) {
        throw new ApiCallFaultyResponseException(`Handle: ${handle}`);
      }

      delete this.responses[handle];
      return response.getResponseData();
    }

    return undefined;
  }

  private getApiUrl(): string {
    return `${this.server ?? ""}${encodeURIComponent(this.apiVersion)}/api.php`;
  }

  setApiVersion(apiVersion: string): void {
    this.apiVersion = apiVersion;
  }

  setServer(server: string): void {
    this.server = server;
  }

  getErrors(): Record<number, Record<string, unknown>> {
    return this.errors;
  }

  addCache(cache: onOfficeSDKCache): void {
    this.caches.push(cache);
  }

  removeCacheInstances(): void {
    this.caches = [];
  }
}
