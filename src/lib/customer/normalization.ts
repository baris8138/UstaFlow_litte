export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  const normalized = value.trim().replace(/[\s().-]/g, "");

  if (normalized.startsWith("+")) {
    return normalized;
  }

  if (normalized.startsWith("0090")) {
    return `+90${normalized.slice(4)}`;
  }

  if (/^90\d{10}$/.test(normalized)) {
    return `+${normalized}`;
  }

  if (/^0\d{10}$/.test(normalized)) {
    return `+90${normalized.slice(1)}`;
  }

  if (/^\d{10}$/.test(normalized)) {
    return `+90${normalized}`;
  }

  return normalized;
}

export function normalizeOptionalText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized === "" ? null : normalized;
}
