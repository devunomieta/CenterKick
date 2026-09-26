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

