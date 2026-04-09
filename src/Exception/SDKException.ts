export class SDKException extends Error {
  constructor(message = "SDKException") {
    super(message);
    this.name = "SDKException";
  }
}
