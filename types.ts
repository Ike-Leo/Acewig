/**
 * Ace Wig Storefront - Type Definitions
 * 
 * Comprehensive types for the e-commerce frontend matching the Storefront API.
 */

// =====================================
// Product Types
// =====================================

/** Product variant options (e.g., size, color) */
export interface VariantOptions {
  [key: string]: string;
}

/** Product variant from API */
export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number; // in cedis (converted from cents)
  stockQuantity: number;
  options: VariantOptions;
  isDefault: boolean;
}

/** Base product from API (raw format) */
export interface ApiProductRaw {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number; // in cents from API
  images: string[];
  inStock: boolean;
  totalStock: number;
  categoryName?: string;
  variants: ProductVariant[];
}

/** Frontend product with converted prices */
export interface Product {
  id: number | string;
  name: string;
  slug?: string;
  price: number; // in cedis (for display)
  originalPrice?: number;
  description?: string;
  image: string;
  images?: string[];
  isNew?: boolean;
  inStock?: boolean;
  totalStock?: number;
  categoryName?: string;
  variants?: ProductVariant[];
}

/** Full product details for product page/modal */
export interface ProductDetails extends Product {
  variants: ProductVariant[];
  relatedProducts?: Product[];
}

// =====================================
// Cart Types
// =====================================

/** Item in the shopping cart */
export interface CartItem {
  _id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number; // in cedis
  quantity: number;
  maxStock: number;
  total: number; // price * quantity in cedis
  variantName?: string;
}

/** Shopping cart state */
export interface Cart {
  _id: string;
  totalAmount: number; // in cedis
  totalItems: number;
  items: CartItem[];
}

// =====================================
// Category Types
// =====================================

/** Product category */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  position: number;
  productCount?: number;
}

// =====================================
// Order Types
// =====================================

/** Order status values */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/** Payment status values */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/** Item in an order (snapshot at time of purchase) */
export interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: number; // in cedis
}

/** Order details for tracking */
export interface Order {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number; // in cedis
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  items: OrderItem[];
}

// =====================================
// Customer Types
// =====================================

/** Customer information for checkout */
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
}

// =====================================
// UI Types
// =====================================

/** Navigation item */
export interface NavItem {
  label: string;
  href: string;
}

/** Customer review */
export interface Review {
  id: number;
  rating: number;
  text: string;
  title: string;
  author?: string;
  source?: string;
}

/** Toast notification type */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Toast notification */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/** Modal types for app state */
export type ModalType = 'cart' | 'quickview' | 'checkout' | 'confirmation' | 'tracking' | null;

/** App-level UI state */
export interface AppState {
  activeModal: ModalType;
  selectedProduct: Product | null;
  selectedVariant: ProductVariant | null;
  lastOrderId: string | null;
  toasts: Toast[];
}

// =====================================
// Filter Types
// =====================================

/** Product filters for shop section */
export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
}

// =====================================
// Pagination Types
// =====================================

/** Paginated response */
export interface PaginatedProducts {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}