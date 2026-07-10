# CenterKick Typography Guidelines

## Strict Typography Rules
To maintain a premium, cohesive design, we strictly enforce a typography scale based on standard Tailwind CSS classes. 
**Never use hardcoded pixel values (e.g., `text-[12px]`, `text-[14px]`). This is strictly forbidden.**

### Font Sizes
- `text-xs`: For small text, tags, badges, very minor labels (12px). Use this instead of `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`, or `text-[12px]`.
- `text-sm`: Secondary body text, forms, dense UI tables.
- `text-base`: Primary body text, standard paragraphs.
- `text-lg`: Large body text, emphasis, small component titles.
- `text-xl`: Sub-headings (H4), card titles.
- `text-2xl`: Section headings (H3).
- `text-3xl`: Page headings (H2).
- `text-4xl`: Main Hero headings (H1).
- `text-5xl`: Display text, very large hero text.

### Font Weights
- `font-normal`: Standard body text and paragraphs.
- `font-medium`: Buttons, navigational links, table headers, subtitles.
- `font-semibold`: Small card titles, important emphasized text.
- `font-bold`: Standard headings (H1-H6).
- `font-black`: **Restricted Use:** Only for massive display text (e.g., `text-5xl` and above) or brand logos where extreme visual weight is required. Do NOT use for standard UI text.

## Migration Files Naming
Whenever generating a new Supabase migration file, always ensure to include a title comment at the very top of the file using the format: `-- title: [Your Title Here]` so that it is properly named in the Supabase Studio SQL Editor.

# CenterKick UX Guidelines

## Feedback Toast Notifications
Every action that requires user feedback (e.g., success, error, warnings, validation failures) MUST trigger a toast notification containing non-technical, user-friendly language instead of inline status text or generic console logs. Always utilize the existing Toast context for this.
