export interface onOfficeSDKCache {
  getHttpResponseByParameterArray(parameters: Record<string, unknown>): string | null;
  write(parameters: Record<string, unknown>, value: string): boolean;
  cleanup(): void;
  clearAll(): void;
}
