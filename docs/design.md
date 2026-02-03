# Design System Prompt — Project Management Dashboard

> Ce fichier est un prompt réutilisable à passer à Claude (avec la skill `frontend-design`) pour générer des interfaces qui respectent le même langage visuel que le dashboard de référence.

---

## 1. Aesthetic Direction & Tone

The overall tone is **refined minimalism with warm neutrality**. The interface feels calm, professional, and uncluttered. There is no gradient, no bold color splash, no decorative element that doesn't serve a functional purpose. Whitespace is generous and intentional. Everything breathes.

Commit to this direction fully: **clean, corporate-soft, light, structured, data-dense but never overwhelming**.

---

## 2. Color Palette

Use CSS variables. The palette is intentionally restrained.

```css
:root {
  /* Backgrounds */
  --bg-page:        #edecea;   /* warm off-white page background */
  --bg-surface:     #ffffff;   /* cards, sidebar, main content */
  --bg-sidebar:     #ffffff;
  --bg-input:       #f5f4f2;   /* search bars, subtle input fills */
  --bg-row-hover:   #fafaf8;   /* very subtle row hover */

  /* Text */
  --text-primary:   #1a1a1a;   /* headings, task names */
  --text-secondary: #6b6b6b;   /* column headers, labels, breadcrumbs */
  --text-muted:     #999999;   /* placeholder, disabled */

  /* Borders */
  --border-default: #e8e6e3;   /* card borders, table dividers */
  --border-focus:   #c4c0bb;

  /* Priority / Status accents — used ONLY for small semantic labels */
  --accent-high-bg:   #fff0ec;
  --accent-high-text: #d45a3a;
  --accent-med-bg:    #fef3e2;
  --accent-med-text:  #c88a2a;
  --accent-low-bg:    #eef6f0;
  --accent-low-text:  #4a9e6b;

  /* Progress bar fills */
  --progress-green:   #5cb85c;
  --progress-orange:  #e6a030;
  --progress-red:     #e05a4a;

  /* CTA (primary action button) */
  --btn-primary-bg:   #1a1a1a;
  --btn-primary-text: #ffffff;

  /* Type badge backgrounds */
  --badge-feature-bg:   #f0f4ff;
  --badge-bug-bg:       #fff2f0;
  --badge-review-bg:    #f5f0ff;
  --badge-testing-bg:   #f0faf2;
}
```

**Rule:** Never introduce a strong saturated color outside the accent set above. The UI stays visually quiet; color is reserved for meaning, never decoration.

---

## 3. Typography

- **Font family:** Use a single sans-serif font that is clean, slightly geometric, and has good weight range — e.g. `"Inter"`, `"DM Sans"`, or `"Geist Sans"`. Apply it to the entire app via `body`.
- **Heading (page title):** `font-size: 28–32px`, `font-weight: 700`, `color: var(--text-primary)`.
- **Section title (e.g. "Refactor login flow"):** `font-size: 15–16px`, `font-weight: 600`, `color: var(--text-primary)`.
- **Column headers / labels:** `font-size: 13px`, `font-weight: 500`, `color: var(--text-secondary)`, `text-transform: none`.
- **Body / cell text:** `font-size: 13–14px`, `font-weight: 400`, `color: var(--text-primary)`.
- **Badges & tags:** `font-size: 12px`, `font-weight: 500`.

**Rule:** Never use more than two font weights in one screen (400 + 600, or 500 + 700). Keep sizing tight between 12–16px for data content. The page title is the only element allowed to go above 20px.

---

## 4. Layout Structure

### 4.1 Page-level layout
```
┌──────────┬─────────────────────────────────┐
│ Sidebar  │         Main Content            │
│ 240px    │   flex-grow: 1; padding: 32px   │
│ fixed    │                                 │
└──────────┴─────────────────────────────────┘
```

- The page background (`--bg-page`) is visible around the app shell. The entire app sits inside a **rounded container** (`border-radius: 14–16px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.06)`) that contains both the sidebar and the main content.
- Main content has generous left/right padding (~32px).

### 4.2 Sidebar
- Background: `--bg-surface` (white).
- A light vertical border separates it from the main content (`border-right: 1px solid var(--border-default)`).
- Top section: user avatar + name + company in small text, with a collapse arrow icon.
- A search bar with a placeholder and a keyboard shortcut hint (e.g. `⌘ F`) on the right, styled with `--bg-input` fill and subtle border.
- Navigation items are grouped under labeled sections: **Essentials**, **Projects**, **Management**, **Support**, **Apps**. Section labels are uppercase or capitalized, `font-size: 11–12px`, `color: var(--text-muted)`, with a small gap above each group.
- Each nav item: icon on the left (16–18px), label, full-width clickable row. The **active item** gets a very light background (`--bg-row-hover` or a tint) and slightly bolder text.
- Collapsible sections use a chevron that rotates. Collapsed sections hide their children smoothly.
- Project items in the sidebar show a small colored circle icon (each project gets a distinct hue) to the left of the name.

### 4.3 Main content header
- Page title ("Teams") large and bold, top-left.
- Action buttons top-right, aligned in a row: one **primary button** (dark fill, white text, rounded `8px`) and one or two **secondary buttons** (white fill, `1px` border, rounded `8px`, with an icon prefix).
- Below the title: a **tab bar** (e.g. Department Board | Team Overview | All tasks). Tabs are plain text; the active tab is underlined with a thin dark bar (`2px`), others are `--text-secondary`.
- A local **search bar** sits top-right of the task area, styled identically to the sidebar search.

---

## 5. Data Tables / Task Groups

Each task group is a **card**:
- `background: --bg-surface`
- `border: 1px solid var(--border-default)`
- `border-radius: 10–12px`
- `padding: 20–24px`
- Vertical spacing between cards: `24–28px`.

### 5.1 Card header
- Group title (bold, 15–16px) on the left.
- A small icon + count badge next to the title (e.g. clipboard icon + "4"), rendered in muted gray.
- A **Filter** button on the far right: icon + text, light border, rounded `6–8px`.

### 5.2 Table inside the card
- **No visible outer border** on the table itself — the card provides the container.
- Column headers: `--text-secondary`, `font-weight: 500`, `font-size: 13px`. A thin `1px` border-bottom separates headers from the first row.
- Rows: separated by `border-bottom: 1px solid var(--border-default)` (the last row has no bottom border).
- Row height: ~44–48px. Content is vertically centered.
- On hover, the row background shifts subtly to `--bg-row-hover`.

### 5.3 Column details

| Column | Rules |
|---|---|
| **Task name** | Primary text, 14px, weight 400. Truncate with ellipsis if too long. |
| **People** | Render as a stack of overlapping small avatars (24–28px circles). Use colored placeholder initials if no image. Overlap offset ~-8px. |
| **Type** | A small **pill badge**: icon (16px) + label. Each type has its own background from the badge palette above (`Feature`, `Bug`, `Review`, `Testing`). Border-radius: 20px (full pill). Padding: `4px 10px`. |
| **Timeline** | Plain text, `--text-secondary`, format: `Mon DD, YYYY – Mon DD, YYYY`. |
| **Priority** | A small pill badge (no icon), background + colored text from the priority accent palette. Same shape as Type badges. |
| **Progress** | Text percentage (`--text-primary`, weight 600) followed by a **thin horizontal bar** (height 4–5px, border-radius 2px, background `--border-default`). The filled portion uses `--progress-green`, `--progress-orange`, or `--progress-red` depending on value. |

---

## 6. Badges & Pills — Detailed Spec

All badges share this base shape:

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;          /* full pill */
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
```

Mapping:

| Badge | bg | text color |
|---|---|---|
| Feature | `--badge-feature-bg` | `#3b5bdb` |
| Bug | `--badge-bug-bg` | `#d45a3a` |
| Review | `--badge-review-bg` | `#7c4dff` |
| Testing | `--badge-testing-bg` | `#3a9e55` |
| High | `--accent-high-bg` | `--accent-high-text` |
| Medium | `--accent-med-bg` | `--accent-med-text` |
| Low | `--accent-low-bg` | `--accent-low-text` |

---

## 7. Buttons

### Primary (e.g. "New Member")
```css
background: var(--btn-primary-bg);   /* near-black */
color: var(--btn-primary-text);
border: none;
border-radius: 8px;
padding: 8px 18px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
```
May include a small icon to the left of the label.

### Secondary (e.g. "New Project", "New Task", "Filter")
```css
background: #fff;
border: 1px solid var(--border-default);
color: var(--text-primary);
border-radius: 8px;
padding: 8px 18px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
```

Both button types get a subtle background darkening on `:hover` (e.g. `filter: brightness(0.95)`).

---

## 8. Icons

- Use a consistent icon set (e.g. Lucide, Heroicons, or Feather).
- Icon size in nav: **16–18px**.
- Icon size inside badges / buttons: **14–16px**.
- Icon color matches the surrounding text color by default.
- Never use filled/heavy icons; prefer **stroke-based** icons to keep the visual weight light.

---

## 9. Spacing & Rhythm

| Element | Value |
|---|---|
| Sidebar width | 240px |
| Main content padding | 32px |
| Gap between cards (task groups) | 24–28px |
| Card internal padding | 20–24px |
| Row height | 44–48px |
| Gap between nav items | 2–4px |
| Gap between section label and first item | 8px |
| Button horizontal padding | 16–20px |

---

## 10. Micro-interactions & Polish

- Nav item hover: background transition `150ms ease`.
- Table row hover: background transition `120ms ease`.
- Button hover: brightness shift `150ms ease`.
- Sidebar collapse/expand: children animate with `max-height` or `opacity` transition over `200ms`.
- No heavy shadows anywhere. Cards use `box-shadow: 0 1px 3px rgba(0,0,0,0.04)` at most.
- Scrollbars (if needed) should be styled thin and match `--border-default`.

---

## 11. Responsive Considerations

- On narrow viewports, the sidebar collapses into an icon-only rail (show only icons, hide labels).
- The main content stacks cards vertically (already the default).
- Tables may horizontally scroll inside their card if the viewport is too narrow rather than breaking layout.

---

## 12. What to Avoid

- No gradients, no glows, no neon accents.
- No large imagery or illustrations.
- No more than 3 accent colors visible at once.
- No decorative borders or patterns.
- No bold/heavy typography outside the page title.
- No rounded avatars larger than 32px in data rows.
- Never center-align table content — everything is left-aligned except Progress which may be left-aligned with its bar.