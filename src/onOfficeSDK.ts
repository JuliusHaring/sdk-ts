import type { onOfficeSDKCache } from "./Cache/onOfficeSDKCache.js";
import { ApiCall } from "./internal/ApiCall.js";

export class onOfficeSDK {
  static readonly ACTION_ID_READ =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:read";
  static readonly ACTION_ID_CREATE =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:create";
  static readonly ACTION_ID_MODIFY =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:modify";
  static readonly ACTION_ID_GET =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:get";
  static readonly ACTION_ID_DO =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:do";
  static readonly ACTION_ID_DELETE =
    "urn:onoffice-de-ns:smart:2.5:smartml:action:delete";

  static readonly RELATION_TYPE_BUYER =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:buyer";
  static readonly RELATION_TYPE_TENANT =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:renter";
  static readonly RELATION_TYPE_OWNER =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner";

  static readonly MODULE_ADDRESS = "address";
  static readonly MODULE_ESTATE = "estate";
  static readonly MODULE_SEARCHCRITERIA = "searchcriteria";

  static readonly RELATION_TYPE_CONTACT_BROKER =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPerson";
  static readonly RELATION_TYPE_CONTACT_PERSON =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPersonAll";
  static readonly RELATION_TYPE_COMPLEX_ESTATE_UNITS =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:complex:estate:units";
  static readonly RELATION_TYPE_ESTATE_ADDRESS_OWNER =
    "urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner";

  private readonly apiCall: ApiCall;

  constructor(apiCall: ApiCall | null = null) {
    this.apiCall = apiCall ?? new ApiCall();
    this.apiCall.setServer("https://api.onoffice.de/api/");
  }

  setApiVersion(apiVersion: string): void {
    this.apiCall.setApiVersion(apiVersion);
  }

  setApiServer(server: string): void {
    this.apiCall.setServer(server);
  }

  setApiCurlOptions(curlOptions: unknown): void {
    this.apiCall.setCurlOptions(curlOptions);
  }

  callGeneric(
    actionId: string,
    resourceType: string,
    parameters: Record<string, unknown> | unknown[],
  ): number {
    return this.apiCall.callByRawData(
      actionId,
      "",
      "",
      resourceType,
      parameters,
    );
  }

  call(
    actionId: string,
    resourceId: string,
    identifier: string | null,
    resourceType: string,
    parameters: Record<string, unknown> | unknown[],
  ): number {
    return this.apiCall.callByRawData(
      actionId,
      resourceId,
      identifier,
      resourceType,
      parameters,
    );
  }

  async sendRequests(token: string, secret: string): Promise<void> {
    await this.apiCall.sendRequests(token, secret);
  }

  getResponseArray(number: number): Record<string, unknown> | undefined {
    return this.apiCall.getResponse(number);
  }

  addCache(cache: onOfficeSDKCache): void {
    this.apiCall.addCache(cache);
  }

  setCaches(cacheInstances: onOfficeSDKCache[]): void {
    cacheInstances.forEach((cache) => this.apiCall.addCache(cache));
  }

  removeCacheInstances(): void {
    this.apiCall.removeCacheInstances();
  }

  getErrors(): Record<number, Record<string, unknown>> {
    return this.apiCall.getErrors();
  }
}
