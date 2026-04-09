import { SDKException } from "./SDKException.js";

export class HttpFetchNoResultException extends SDKException {
  private curlErrno: number | null = null;

  constructor(message = "No HTTP result") {
    super(message);
    this.name = "HttpFetchNoResultException";
  }

  getCurlErrno(): number | null {
    return this.curlErrno;
  }

  setCurlErrno(errno: number): void {
    this.curlErrno = errno;
  }
}
