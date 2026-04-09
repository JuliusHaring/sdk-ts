import { SDKException } from "./SDKException.js";

export class ApiCallNoActionParametersException extends SDKException {
  constructor(message = "No action parameters") {
    super(message);
    this.name = "ApiCallNoActionParametersException";
  }
}
