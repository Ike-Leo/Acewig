# Site Configuration & Workflow Registry

**Project:** Perf - Signature Scents
**Aesthetic:** Eternal Gold & Obsidian (Dark Luxury)

This document records the architectural processes established to transform the codebase. AI agents must follow these workflows to maintain consistency.

## 1. Initialization & Analysis Workflow
**Trigger:** Start of project or major context switch.

1.  **Scan & Map:** `list_dir` to understand non-ignored assets.
2.  **Deep Read:** Analyze `package.json`, `vite.config.ts`, and entry points (`App.tsx`).
3.  **Knowledge Consolidation:** Output findings to `knowledge_base.md`.
    *   *Expectation:* Identify architecture (SPA), styling method (Tailwind), and state management.

## 2. Design System Construction Workflow
**Trigger:** New design requirements or aesthetic overhaul.

1.  **Skill Invocation:** Use `frontend-design` skill methodology.
2.  **Token Definition (`design_system.md`):**
    *   Define **Semantic Slots** (not just palette): `background-void`, `text-primary`.
    *   Define **Scales**: Typography (Serif/Sans), Spacing (8px), Radius.
3.  **Config Translation:** Manually map markdown definitions to `tailwind.config.js`.
    *   *Expectation:* No magic numbers in code. All visuals strictly derived from config.

## 3. Infrastructure Migration Workflow
**Trigger:** Upgrading from prototype (CDN) to production (Build).

1.  **Dependency Install:** `npm install -D tailwindcss postcss autoprefixer`.
2.  **Config Generation:**
    *   `tailwind.config.js`: inject project-specific Design Tokens.
    *   `postcss.config.js`: Standard export.
    *   `index.css`: `@tailwind` directives + Custom Layers (e.g., `.glass`).
3.  **Entry Point Cleanup:**
    *   `index.tsx`: Import `./index.css`.
    *   `index.html`: Remove CDNs and inline `<style>` blocks.

## 4. Component Refactoring Workflow
**Trigger:** Applying the design system to existing code.

1.  **Audit:** Identify hardcoded values (Hex codes, arbitrary pixels).
2.  **Semantic Mapping:**
    *   Replace `bg-[#0F0A06]` → `bg-background`
    *   Replace `text-gray-300` → `text-foreground-muted`
    *   Replace `border-gray-600` → `border-border/30`
3.  **Aesthetic Verification:** Ensure interactions (hover/focus) use defined `primary` and `accent` tokens.
    *   *Expectation:* Codebase is purely semantic; verify via `grep` for hex codes (should be 0).
    
## 5. Content Injection Workflow
**Trigger:** Updating placeholder text with brand-specific copy.

1.  **Source Identification:** Locate source material (Text files, Images, PDFs).
2.  **Theme Alignment:** Ensure tone matches "Dark Luxury" (Mysterious, Elegant, Timeless).
3.  **Content Types:**
    *   **Hero:** Impactful, short, serif-heavy.
    *   **Products:** Evocative names (e.g., "Midnight Saffron" vs "Smell Good").
    *   **Micro-copy:** "Unveil" instead of "Show", "Acquire" instead of "Buy".
4.  **Implementation:** Update `App.tsx` constants (`PRODUCTS`, `REVIEWS`, `NAV_ITEMS`).

## 6. Agent Workflow Rules
*   **Source of Truth:** Always read `design_system.md` and `tailwind.config.js` before generating UI code.
*   **Prohibition:** Never introduce new colors or arbitrary spacing without updating the configuration first.
*   **Consistency:** All new features must adhere to the "Dark Luxury" aesthetic defined in Phase 2.
*   **Documentation Protocol:** Every major architectural change, new workflow, or process alteration MUST be recorded in this file immediately. Maintain the "Change Log" below.

## 7. Change Log
*   **[2026-01-19] Initial Setup**: Established specific workflows for Analysis, Design System, Infrastructure, and Refactoring. Created `siteconfig.md` to track process adherence. Refactored `App.tsx` to use design tokens.
*   **[2026-01-19] Bugfix**: Fixed `[plugin:vite:css] [postcss]` error caused by Tailwind CSS v4 usage. Installed `@tailwindcss/postcss`, updated `postcss.config.js`, and changed `index.css` to use `@import "tailwindcss"` instead of deprecated `@tailwind` directives. Also removed duplicate JSX attribute in `App.tsx`.
*   **[2026-01-19] Resolution - Tailwind v4 Migration**: Tailwind v4 requires `@theme` directive in CSS to define custom tokens (colors, fonts, radii). The `tailwind.config.js` file is no longer used for theme extension. All design tokens are now defined in `index.css` using CSS custom properties within `@theme { }`. **Application verified running successfully.**
*   **[2026-01-19] Polish**: Updated Google Fonts import to include all italic weights (400-900) for Playfair Display. Styled the hero section ampersand (`&`) to be italicized to match the swash design in the reference image.
*   **[2026-01-19] Content**: Injected authentic "Ace Wig & More" brand copy, sourced from company assets. Updated Hero to "Ace Wig Salon & Luxe Shop", renamed products to "Ace Signature Bob", "Luxury Deep Wave", etc., and added real customer testmonials from provided chat screenshots. Positioned as "Affordable Luxury".
*   **[2026-01-19] Skill Creation**: Created `brand-voice/SKILL.md` — a comprehensive copywriting & branding skill modeled after `frontend-design`. Includes: Voice Token System (personality axes, vocabulary tiers, emotional registers), Brand Archaeology Framework, AIDA-E copy structure, content type specs, 4 voice direction templates, and quality checklists.
*   **[2026-01-19] Brand Profile**: Created `brand-voice/ace-wig-brand-profile.md` — Complete brand strategy document derived from 46 company images. Includes: Brand Archaeology (all evidence audited), Identity Core, Audience Personas, Voice Token System (positioned 70% casual, 65% approachable, 75% expressive), 4 Messaging Pillars (Quality 40%, Accessibility 30%, Service 20%, Transformation 10%), Content Specifications for Hero/Products/Testimonials/Navigation, Social Media Guidelines, Full Product Catalog (11 SKUs with pricing), Verified Contact Info, and Implementation Checklist.
*   **[2026-01-19] API Integration**: Integrated Storefront HTTP API from `storefrontapi/` documentation. Created: `src/services/api.ts` (typed API client with session management, product/category/cart/checkout/order endpoints), `src/services/hooks.ts` (React hooks for useProducts, useCart, useCategories with pagination), `src/contexts/CartContext.tsx` (global cart state). Updated `App.tsx` with: live product fetching, loading states, cart badge, add-to-cart buttons, graceful fallback to static data. Added API config to `.env.local` (VITE_API_BASE_URL, VITE_ORG_SLUG).
*   **[2026-01-19] Skill Creation**: Created `excel-content/SKILL.md` — comprehensive spreadsheet/tabular data generation skill modeled after `frontend-design`. Includes: Schema-First Methodology, Data Token System (ID/Category/Currency/Quantity/Text/Date/Boolean/Reference tokens), 5 Template Types (E-Commerce Catalog, Inventory Tracker, Content Calendar, Customer Database, Pricing Sheet), Validation Rules (type/uniqueness/referential integrity), Output Formatting (CSV/TSV/JSON/Excel/Markdown), Master Prompt Templates, and Quality Checklists. Added `templates/ace-wig-products.csv` (11 products) and `templates/ace-wig-schema.md` (full schema specification).
*   **[2026-01-20] E-Commerce Frontend Implementation**: Implemented complete e-commerce storefront flow using Ralph methodology (PRD at `ralph/storefront-prd.json`). Created: `types.ts` (extended with Product, Cart, Order, Toast, Modal types), `src/contexts/AppContext.tsx` (global modal & toast state), `src/components/QuantityPicker.tsx`, `src/components/VariantSelector.tsx`, `src/components/SearchBar.tsx` (instant search with dropdown), `src/components/CartDrawer.tsx` (slide-out cart), `src/components/ProductQuickView.tsx` (product detail modal), `src/components/CheckoutModal.tsx` (customer info form + order submission), `src/components/OrderConfirmation.tsx` (success view), `src/components/OrderTracking.tsx` (order lookup), `src/components/Toast.tsx` (notification system). Updated `App.tsx` with AppProvider wrapper, all modal integrations, enhanced ProductCard with Quick View, and toast notifications. **14/17 user stories complete. Full e-commerce flow verified via browser testing.**
