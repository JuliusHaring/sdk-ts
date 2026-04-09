import { HttpFetchNoResultException } from "../Exception/HttpFetchNoResultException.js";

export class HttpFetch {
  private readonly url: string;
  private readonly postData: string;
  private headers: Record<string, string> = {};

  constructor(url: string, postData: string) {
    this.url = url;
    this.postData = postData;
  }

  setCurlOptions(_curlOptions: unknown): void {
    // Kept for behavioral parity; TS client uses fetch options only.
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  async send(): Promise<string> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.headers,
      },
      body: this.postData,
    });

    const text = await response.text();

    if (!text) {
      throw new HttpFetchNoResultException("Empty HTTP response body");
    }

    return text;
  }
}
