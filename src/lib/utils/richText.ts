/**
 * Strips Tiptap-authored HTML down to plain, paragraph-broken text.
 * Used anywhere a bio needs to render somewhere that can't render arbitrary
 * HTML (PDF export, meta descriptions) — images/embeds are dropped entirely,
 * not just unsupported, since a CV export should be text-only by design.
 */
export function stripHtmlToPlainText(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<(p|div|h[1-6]|li)[^>]*>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n')
    .trim();
}
