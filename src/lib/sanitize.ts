/**
 * High-security input sanitization and verification helpers.
 * Guards against Cross-Site Scripting (XSS), script injections, and logical formatting bypasses.
 */

/**
 * Escapes generic string characters susceptible to XSS injections.
 */
export function sanitizeString(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes names to only allow alphabets, spaces, hyphens, and apostrophes.
 */
export function sanitizeName(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[^a-zA-Z\s\-']/g, '') // strip scripts, digits, symbols
    .slice(0, 100); // hard character limit
}

/**
 * Sanitizes phone numbers to only allow digits, plus sign, hyphens, and spaces.
 */
export function sanitizePhone(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[^0-9\+\-\s]/g, '')
    .slice(0, 20);
}

/**
 * Sanitizes country names to only allow letters, spaces, and hyphens.
 */
export function sanitizeCountry(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[^a-zA-Z\s\-]/g, '')
    .slice(0, 80);
}

/**
 * Sanitizes standard alphanumeric reference numbers (e.g. payment references).
 */
export function sanitizeReference(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[^a-zA-Z0-9\-\_]/g, '')
    .slice(0, 50);
}
