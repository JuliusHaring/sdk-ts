import { SDKException } from "./SDKException.js";

export class ApiCallFaultyResponseException extends SDKException {
  constructor(message = "Faulty response") {
    super(message);
    this.name = "ApiCallFaultyResponseException";
  }
}
