
# Design System: Ace Wig & More

**Version:** 1.1.0
**Aesthetic Definition:** "Eternal Gold & Obsidian (Dark Luxury)"
**Tech Stack:** React + TypeScript + Tailwind CSS (v4)

---

## 1. Core Principles

1.  **Aesthetic**: A premium "Dark Luxury" experience. Deep, void-like backgrounds (`bg-background-void`) serve as a canvas for metallic gold accents (`text-primary`, `border-primary`) and high-impact imagery. This reflects the "Magic Gold Box" concept: mysterious, valuable, and transformative.
2.  **Interaction**:
    *   **Parallax**: Hero backgrounds move slower than foreground content to create depth.
    *   **Scroll Reveal**: Sections fade in (`opacity-0` -> `opacity-100`) and slide up (`y-30` -> `y-0`) as the user navigates.
    *   **Micro-interactions**: Hover states trigger subtle scales (`scale-105`), glows (`shadow-gold`), or border transitions.
3.  **Typography**:
    *   **Headings**: `Playfair Display` (Serif) for majesty and elegance. Used for all major section titles.
    *   **Body**: `Lato` or `Inter` (Sans-serif) for clean readability and modern UX.
    *   **Accents**: Gold gradients or italicized serif text for emphasis within headings.

---

## 2. Design Tokens (Tailwind v4 / CSS Variables)

These tokens are defined in `index.css` via `@theme`.

### 2.1 Color Palette

| Token | CSS Variable | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `--color-background-void` | `#050302` | Main page background (Deepest Black/Brown) |
| | `--color-background-wood` | `#1E140F` | Footer / Secondary sections |
| | `--color-background-card` | `#2A1B12` | Card surface |
| **Primary (Gold)** | `--color-primary` | `#E6C075` | Brand Accent, Buttons, Highlights |
| | `--color-primary-dim` | `#C4A464` | Muted gold for borders/subtle text |
| | `--color-primary-light`| `#F3D9A0` | Hover states, gradients |
| **Text** | `--color-foreground` | `#F2F2F2` | Primary Reading Text |
| | `--color-foreground-muted`| `#D4C5B9` | Secondary Text |

### 2.2 Typography

*   **Font Family**:
    *   `font-serif`: "Playfair Display", serif
    *   `font-sans`: "Lato", sans-serif

### 2.3 Layout & Spacing

*   **Split Section Layout** (Signature of Services/About):
    *   **Desktop**: 50/50 split. Text on one side (padded), Image on the other (full height).
    *   **Alternating**: Row direction alternates (`flex-row` vs `flex-row-reverse`) for visual rhythm.
    *   **Mobile**: Stacked layout (`flex-col`). Visuals typically come after text or stack naturally.

---

## 3. Component Patterns

### 3.1 Hero Section
*   **Structure**: Full viewport height (`min-h-screen` or `90vh`).
*   **Background**: High-res image with Parallax effect (`useTransform(scrollY, ...)`).
*   **Overlay**: Gradient `from-black/80 via-black/40 to-background-void` to ensure text readability.
*   **Content**: a centered or left-aligned `<h1>` using `font-serif`.
*   **Particle/Ambience**: *Optional/Removed* (Clean aesthetic preferred).

### 3.2 Split Content Cards (Services/About)
*   **Container**: `min-h-[70vh]`, `flex`, `overflow-hidden`.
*   **Text Side**: `bg-background-void/5`, vivid typography, refined spacing (`p-8 md:p-24`).
*   **Visual Side**: Image container with hover zoom effect (`hover:scale-105`).
*   **Details**:
    *   Gold divider line above labels.
    *   Numbered indexing (e.g., "01", "02").
    *   "Floating" Icon overlay in the center of the image.

### 3.3 Call to Action (CTA) Strip
*   **Structure**: `py-32`, centered text.
*   **Background**: Radial gradient or subtle texture.
*   **Interaction**: Button with `whileHover` scale and shadow glow (`shadow-[0_0_20px_rgba(230,192,117,0.3)]`).

---

## 4. Implementation Guidelines (Services & About)

When building pages, follow this checklist:

1.  **Imports**:
    *   `framer-motion` for all animations.
    *   `lucide-react` for iconography.
    *   `clsx` / `tailwind-merge` for class handling.
2.  **Scroll Hooks**:
    *   Use `useScroll` for the progress bar and parallax background.
3.  **Animation Variants**:
    *   **Fade Up**: `initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}`.
    *   **Stagger**: Use individual delays for list items.

---

## 5. Usage in `AboutPage.tsx`
The `AboutPage` should mirror the `ServicesPage` structure:
1.  **Hero**: Introduces the Brand Story ("The Ace Story") with implied majesty.
2.  **Content Sections**:
    *   **Story/Origin**: Text Left / Image Right.
    *   **Mission/Values**: Image Left / Text Right.
    *   **Founder/Team**: Text Left / Image Right.
3.  **Footer**: Same CTA as services ("Transformation" link).
