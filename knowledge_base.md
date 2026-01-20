# Codebase Analysis: Perf - Signature Scents

## 📌 Project Overview

**Perf** is a **luxury e-commerce landing page** for high-end perfumes/fragrances. It's built as a **Single Page Application (SPA)** emphasizing visual storytelling through a high-contrast aesthetic ("Eternal Gold & Obsidian" theme).

| Attribute | Value |
|-----------|-------|
| **Project Name** | `perf---signature-scents` |
| **Type** | Luxury E-commerce Landing Page |
| **Framework** | React 19 with TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS (via CDN) |
| **Icons** | Lucide React |

## 🗂️ File Structure

```
g:/Acewigs/acewig/
├── .env.local           # Environment variables (Gemini API Key placeholder)
├── .gitignore           # Git ignore rules
├── App.tsx              # Main application component (~346 lines)
├── index.html           # HTML entry point with Tailwind config
├── index.tsx            # React DOM render entry point
├── metadata.json        # App metadata for AI Studio
├── package.json         # Dependencies and scripts
├── tdd.md               # Technical Design Document
├── tsconfig.json        # TypeScript configuration
├── types.ts             # TypeScript interfaces
├── vite.config.ts       # Vite build configuration
└── README.md            # Project readme
```

## 🔧 Technology Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.3 | UI Library |
| `react-dom` | ^19.2.3 | React DOM bindings |
| `lucide-react` | ^0.562.0 | Icon library |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@vitejs/plugin-react` | ^5.0.0 | React plugin for Vite |
| `typescript` | ~5.8.2 | Type checking |
| `vite` | ^6.2.0 | Build tool & dev server |
| `@types/node` | ^22.14.0 | Node.js type definitions |

## 🎨 Design System

### Color Palette (from `index.html` Tailwind config)
| Token | Hex | Usage |
|-------|-----|-------|
| `perf-dark` | `#0F0A06` | Main background (Deep Coffee/Black) |
| `perf-blue` | `#1E140F` | Dark Brown (legacy naming) |
| `perf-card` | `#2A1B12` | Card backgrounds (Warm Dark Wood) |
| `perf-gold` | `#E6C075` | Primary accent, buttons |
| `perf-gold-light` | `#F3D9A0` | Secondary text/icons |
| `perf-accent` | `#5D4037` | Hover states, scrollbar thumbs |

### Typography
| Type | Font Family |
|------|-------------|
| **Headings** | Playfair Display (Serif) |
| **Body** | Lato (Sans-serif) |

## 🧩 Component Architecture

The entire application is contained within `App.tsx` with the following component hierarchy:

```
App
├── Navbar
│   ├── Logo
│   ├── DesktopNavigation (hidden on mobile)
│   ├── IconGroup (Search, Cart, MobileToggle)
│   └── MobileMenu (conditional render)
├── Hero
│   ├── BackgroundLayers (Gradients/Blobs)
│   ├── TextContent
│   └── VisualContent
│       ├── MainImage (Statue)
│       └── FloatingBadge ("Shop Now")
├── ShopSection
│   ├── SectionHeader
│   └── ProductGrid
│       └── ProductCard (×6)
├── ReviewsSection
│   ├── SectionHeader
│   └── ReviewGrid
│       └── ReviewCard (×2)
└── Footer
```

## 📊 Data Models (`types.ts`)

```typescript
interface Product {
  id: number;
  name: string;      // e.g., "Rosewood Bliss"
  price: number;     // e.g., 50.0
  image: string;     // Unsplash URL
  isNew?: boolean;   // Optional badge flag
}

interface Review {
  id: number;
  rating: number;    // 1-5
  text: string;      // Review content
  title: string;     // Review summary
}

interface NavItem {
  label: string;     // Display text
  href: string;      // Anchor link ID
}
```

## 🔄 State Management

Currently uses **local React state** (`useState`):
- `isScrolled` → Navbar visual state on scroll
- `mobileMenuOpen` → Mobile navigation visibility

## 📱 Responsive Design

- **Mobile-first approach** using Tailwind breakpoints
- Product grid: `grid-cols-2` on mobile → `lg:grid-cols-3` on desktop
- Hero: Vertical stack on mobile → 2-column split on desktop
- Search input hidden on small screens (`hidden sm:block`)

## ⚙️ Configuration Files

### Vite Config (`vite.config.ts`)
- Runs on port **3000**
- Host set to `0.0.0.0` for network access
- Path alias `@` → project root
- Exposes `GEMINI_API_KEY` environment variable

### TypeScript Config (`tsconfig.json`)
- Target: ES2022
- JSX: `react-jsx`
- Module resolution: `bundler`
- No emit (type checking only)

## 🌟 Key Features

1. **Glassmorphism Effects** - Navbar and cards use `backdrop-blur` for depth
2. **Scroll-based Navbar** - Changes from transparent to frosted on scroll
3. **Hover Animations** - Product cards scale and translate on hover
4. **Custom Scrollbar** - Styled to match the luxury aesthetic
5. **Responsive Mobile Menu** - Full-width dropdown with blur effect

## 🚧 Current Limitations / Future Work (from TDD)

1. **No Cart Functionality** - Currently static display only
2. **No Routing** - Single page without React Router
3. **No Backend Integration** - All data is hardcoded
4. **Gemini API Integration** - Placeholder configured but unused
5. **Accessibility (a11y)** - Partially implemented

## 💡 Key Observations

1. **No `index.css`** - The HTML references `/index.css` but this file doesn't exist in the root. All styling is done via Tailwind utility classes inline.

2. **ES Modules via CDN** - The project supports both Vite bundling AND browser-native ES modules via `esm.sh` (importmap in `index.html`).

3. **AI Studio Integration** - The `metadata.json` and README indicate this was created/deployed via Google AI Studio.

4. **Clean Architecture** - Well-documented TDD with clear component specifications.
