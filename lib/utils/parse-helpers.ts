/**
 * Parse array field that might be JSON string or array
 */
export function parseArrayField(field: string[] | string): string[] {
  if (Array.isArray(field)) {
    return field;
  }
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
