import { Request } from "./Request.js";

export class Response {
  private readonly request: Request;
  private readonly responseData: Record<string, unknown>;

  constructor(request: Request, responseData: Record<string, unknown>) {
    this.request = request;
    this.responseData = responseData;
  }

  isValid(): boolean {
    return (
      this.responseData.actionid !== undefined &&
      this.responseData.resourcetype !== undefined &&
      this.responseData.data !== undefined
    );
  }

  isCacheable(): boolean {
    return this.isValid() && Boolean(this.responseData.cacheable);
  }

  getRequest(): Request {
    return this.request;
  }

  getResponseData(): Record<string, unknown> {
    return this.responseData;
  }
}
