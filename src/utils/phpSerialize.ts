function serializeString(value: string): string {
  const bytes = Buffer.byteLength(value, "utf8");
  return `s:${bytes}:"${value}";`;
}

function serializeNumber(value: number): string {
  if (Number.isInteger(value)) {
    return `i:${value};`;
  }
  return `d:${value};`;
}

function serializeBoolean(value: boolean): string {
  return `b:${value ? 1 : 0};`;
}

function isSequentialArray(obj: Record<string, unknown>): boolean {
  const keys = Object.keys(obj);
  if (keys.length === 0) return true;
  return keys.every((k, i) => String(i) === k);
}

function serializeArray(value: unknown[] | Record<string, unknown>): string {
  const items: Array<[string | number, unknown]> = Array.isArray(value)
    ? value.map((v, i) => [i, v])
    : Object.entries(value).map(([k, v]) => {
        const asNum = Number(k);
        return Number.isInteger(asNum) && String(asNum) === k
          ? [asNum, v]
          : [k, v];
      });

  const payload = items
    .map(([k, v]) => `${serializeValue(k)}${serializeValue(v)}`)
    .join("");

  return `a:${items.length}:{${payload}}`;
}

export function serializeValue(value: unknown): string {
  if (value === null || value === undefined) return "N;";
  if (typeof value === "string") return serializeString(value);
  if (typeof value === "number") return serializeNumber(value);
  if (typeof value === "boolean") return serializeBoolean(value);

  if (Array.isArray(value)) return serializeArray(value);

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (isSequentialArray(obj)) {
      const arr = Object.keys(obj)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => obj[k]);
      return serializeArray(arr);
    }
    return serializeArray(obj);
  }

  return "N;";
}
