export type JsonRecord = Record<string, unknown>;

export interface ActionParameters {
  actionid: string;
  identifier: string | null;
  parameters: JsonRecord | unknown[];
  resourceid: string;
  resourcetype: string;
  timestamp: number | null;
}

export interface ApiResponseStatus {
  errorcode: number;
  [key: string]: unknown;
}

export interface ApiResult {
  status: ApiResponseStatus;
  actionid?: string;
  resourcetype?: string;
  data?: unknown;
  cacheable?: boolean;
  [key: string]: unknown;
}
