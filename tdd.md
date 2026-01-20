# Technical Design Document: Perf - Signature Scents

## 1. Executive Summary
**Perf** is a high-end, luxury e-commerce landing page designed to market exclusive fragrances. The application emphasizes visual storytelling through a high-contrast aesthetic combining "Eternal Gold" and "Obsidian" themes. It utilizes a responsive Single Page Application (SPA) architecture built with React and Tailwind CSS.

## 2. Technology Stack

### 2.1 Core Framework
*   **Runtime:** Browser-based ES Modules (ESM).
*   **Library:** React 19 (`react`, `react-dom`).
*   **Language:** TypeScript (TSX) for type safety and component definition.

### 2.2 Styling & UI
*   **CSS Framework:** Tailwind CSS (via CDN with custom runtime configuration).
*   **Icons:** Lucide React (feather-light, consistent iconography).
*   **Typography:** Google Fonts.
    *   *Primary/Headings:* Playfair Display (Serif).
    *   *Secondary/Body:* Lato (Sans-serif).

### 2.3 Environment
*   **Build System:** No-build setup using native ES modules (simulated via `esm.sh` imports).
*   **Asset Management:** Unsplash for high-resolution placeholder imagery.

## 3. Design System & UX Strategy

### 3.1 Color Palette
The design pivots from traditional luxury blacks to a warm, deep "Coffee & Wood" palette to evoke organic richness.

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `perf-dark` | `#0F0A06` | Main background (Deep Coffee/Black). |
| `perf-blue` | `#1E140F` | *Legacy naming kept for compatibility*, represents Dark Brown. |
| `perf-card` | `#2A1B12` | Card backgrounds (Warm Dark Wood). |
| `perf-gold` | `#E6C075` | Primary accent, text highlights, buttons. |
| `perf-gold-light` | `#F3D9A0` | Subtler gold for secondary text/icons. |
| `perf-accent` | `#5D4037` | Hover states, scrollbar thumbs. |

### 3.2 Visual Effects
*   **Glassmorphism:** Used in the Navbar (`backdrop-blur-md`) and Product Cards to create depth over the dark background.
*   **Gradients:**
    *   *Hero:* Radial glows using gold opacity to highlight the central statue.
    *   *Cards:* Linear gradients from `#3E2723` to `#1A100A` to simulate polished wood/amber.
*   **Imagery:** "Golden David" aesthetic—classical statues with kintsugi-style gold repairs, set against void-like backgrounds.

### 3.3 Typography Rules
*   **Headings:** `font-serif` (Playfair Display). Used for the "Perf" logo, hero statements, and section titles.
*   **Body:** `font-sans` (Lato). Used for navigation, product descriptions, and reviews.
*   **Tracking:** Extended letter-spacing (`tracking-widest`) on uppercase labels to enhance the luxury feel.

## 4. Component Architecture

The application follows a vertical slice layout contained within `App.tsx`.

### 4.1 Component Tree
```text
App
├── Navbar
│   ├── Logo
│   ├── DesktopNavigation (Hidden on Mobile)
│   ├── IconGroup (Search, Cart, MobileToggle)
│   └── MobileMenu (Conditional Render)
├── Hero
│   ├── BackgroundLayers (Gradients/Blobs)
│   ├── TextContent (Left col desktop / Bottom mobile)
│   └── VisualContent (Right col desktop / Top mobile)
│       ├── MainImage (Statue)
│       └── FloatingBadge ("Shop Now")
├── ShopSection
│   ├── SectionHeader
│   └── ProductGrid (2x2 on Mobile, 3 cols on Desktop)
│       └── ProductCard
├── ReviewsSection
│   ├── SectionHeader
│   └── ReviewGrid
│       └── ReviewCard
└── Footer
```

### 4.2 Key Component Specifications

#### **Navbar**
*   **Behavior:** Sticky positioning. Changes background from transparent to `bg-perf-dark/90` on scroll (`window.scrollY > 50`).
*   **Mobile:** Hamburger menu toggles a full-width dropdown with a glassmorphism effect.

#### **Hero**
*   **Layout:** 
    *   *Desktop:* 2-column split. Text on left, Image on right.
    *   *Mobile:* Vertical stack. Image top, Text bottom.
*   **Visuals:** Contains a specific contrast filter on the hero image (`contrast(1.1) brightness(0.9)`) to blend the black background of the image with the page background.

#### **ShopSection & ProductCard**
*   **Grid Layout:** 
    *   *Mobile:* `grid-cols-2` (Specific requirement to show more density on small screens).
    *   *Desktop:* `lg:grid-cols-3`.
*   **Card Interaction:** Group hover effect.
    *   Image scales up.
    *   Inner radial gradient opacity increases.
    *   Card translates Y-axis slightly up.

## 5. Data Model (`types.ts`)

The application currently uses static data structures, defined via TypeScript interfaces.

### 5.1 Product
```typescript
interface Product {
  id: number;
  name: string;   // e.g., "Rosewood Bliss"
  price: number;  // e.g., 50.0
  image: string;  // URL
  isNew?: boolean; // Optional flag for UI badges
}
```

### 5.2 Review
```typescript
interface Review {
  id: number;
  rating: number; // 1-5
  text: string;   // Review content
  title: string;  // Review summary
}
```

### 5.3 NavItem
```typescript
interface NavItem {
  label: string; // Display text
  href: string;  // Anchor link ID
}
```

## 6. Implementation Guidelines

### 6.1 State Management
*   **Local State:** `useState` is sufficient for current interactivity.
    *   `isScrolled`: Boolean (Navbar visual state).
    *   `mobileMenuOpen`: Boolean (Mobile navigation visibility).
*   **Future State:** If a Cart feature is implemented, a `CartContext` provider should wrap the application to manage the cart array.

### 6.2 Responsive Design Strategy
*   **Breakpoints:** Tailwind defaults (`sm`, `md`, `lg`, `xl`).
*   **Mobile-First Approach:** Base classes target mobile; `md:` and `lg:` prefixes override for desktop.
    *   *Example:* `grid-cols-2 lg:grid-cols-3` in ShopSection ensures the 2-column mobile layout.

### 6.3 Performance Considerations
*   **Images:** Currently using Unsplash CDN with parameters (`q=80`, `w=...`) to optimize load times.
*   **Code:** No heavy external libraries (like Lodash or Moment) are used to keep bundle size minimal.

## 7. Future Roadmap
1.  **Cart Functionality:** Implement a slide-out cart drawer and state management.
2.  **Product Detail Page:** Routing to individual product views using React Router (if converting to multi-page).
3.  **Checkout Integration:** Stripe or similar payment gateway integration.
4.  **Accessibility (a11y):** Ensure all buttons have `aria-labels` and images have descriptive `alt` text (partially implemented).
