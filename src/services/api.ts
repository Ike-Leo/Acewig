/**
 * Ace Wig Storefront API Service Layer
 * 
 * This module provides a clean interface to the Storefront HTTP API.
 * All API calls are centralized here for maintainability.
 */

// === Configuration ===
const API_CONFIG = {
    // Using environment variable or fallback to example deployment
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://acoustic-seahorse-440.convex.site',
    orgSlug: import.meta.env.VITE_ORG_SLUG || 'ace-wig',
};

// Build the full API URL
const getApiUrl = (path: string) =>
    `${API_CONFIG.baseUrl}/api/store/${API_CONFIG.orgSlug}${path}`;

// === Session Management ===
const SESSION_KEY = 'acewig_session_id';

export const getSessionId = (): string => {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

// === API Types ===
export interface ApiProduct {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    price: number; // in cents
    images: string[];
    inStock: boolean;
    totalStock: number;
    categoryName?: string;
    variants: ApiVariant[];
}

export interface ApiVariant {
    _id: string;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    options: Record<string, string>;
    isDefault: boolean;
}

export interface ApiCategory {
    _id: string;
    name: string;
    slug: string;
    parentId: string | null;
    position: number;
    productCount?: number;
}

export interface ApiCart {
    _id: string;
    totalAmount: number;
    totalItems: number;
    items: ApiCartItem[];
}

export interface ApiCartItem {
    _id: string;
    productId: string;
    variantId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    maxStock: number;
    total: number;
}

export interface ApiOrder {
    orderNumber: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    totalAmount: number;
    createdAt: number;
    updatedAt: number;
    items: {
        productName: string;
        variantName: string;
        quantity: number;
        price: number;
    }[];
}

export interface PaginatedResponse<T> {
    products: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

// === API Error Handling ===
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(
            errorData.error || `HTTP ${response.status}`,
            response.status
        );
    }
    return response.json();
};

// === Product API ===
export const productApi = {
    /**
     * List all products with pagination and filtering
     */
    list: async (options?: {
        limit?: number;
        cursor?: string;
        minPrice?: number;
        maxPrice?: number;
        inStockOnly?: boolean;
        categorySlug?: string;
    }): Promise<PaginatedResponse<ApiProduct>> => {
        const params = new URLSearchParams();
        if (options?.limit) params.set('limit', String(options.limit));
        if (options?.cursor) params.set('cursor', options.cursor);
        if (options?.minPrice) params.set('minPrice', String(options.minPrice));
        if (options?.maxPrice) params.set('maxPrice', String(options.maxPrice));
        if (options?.inStockOnly) params.set('inStockOnly', 'true');
        if (options?.categorySlug) params.set('categorySlug', options.categorySlug);

        const url = getApiUrl(`/products${params.toString() ? `?${params}` : ''}`);
        const response = await fetch(url);
        return handleResponse<PaginatedResponse<ApiProduct>>(response);
    },

    /**
     * Search products by query
     */
    search: async (query: string, limit = 20): Promise<ApiProduct[]> => {
        const params = new URLSearchParams({ q: query, limit: String(limit) });
        const url = getApiUrl(`/products/search?${params}`);
        const response = await fetch(url);
        return handleResponse<ApiProduct[]>(response);
    },

    /**
     * Get product details by slug
     */
    getBySlug: async (slug: string): Promise<ApiProduct> => {
        const url = getApiUrl(`/products/${slug}`);
        const response = await fetch(url);
        return handleResponse<ApiProduct>(response);
    },

    /**
     * Get related products
     */
    getRelated: async (slug: string, limit = 4): Promise<ApiProduct[]> => {
        const url = getApiUrl(`/products/${slug}/related?limit=${limit}`);
        const response = await fetch(url);
        return handleResponse<ApiProduct[]>(response);
    },
};

// === Category API ===
export const categoryApi = {
    /**
     * List all categories
     */
    list: async (): Promise<ApiCategory[]> => {
        const url = getApiUrl('/categories');
        const response = await fetch(url);
        return handleResponse<ApiCategory[]>(response);
    },

    /**
     * Get category by slug
     */
    getBySlug: async (slug: string): Promise<ApiCategory> => {
        const url = getApiUrl(`/categories/${slug}`);
        const response = await fetch(url);
        return handleResponse<ApiCategory>(response);
    },

    /**
     * Get products in a category
     */
    getProducts: async (slug: string, limit = 20): Promise<ApiProduct[]> => {
        const url = getApiUrl(`/categories/${slug}/products?limit=${limit}`);
        const response = await fetch(url);
        return handleResponse<ApiProduct[]>(response);
    },
};

// === Cart API ===
export const cartApi = {
    /**
     * Get current cart
     */
    get: async (): Promise<ApiCart | null> => {
        const sessionId = getSessionId();
        const url = getApiUrl(`/cart?sessionId=${sessionId}`);
        const response = await fetch(url);

        if (response.status === 404) {
            return null; // No cart exists yet
        }

        return handleResponse<ApiCart>(response);
    },

    /**
     * Add item to cart
     */
    addItem: async (productId: string, variantId: string, quantity = 1): Promise<{ success: boolean }> => {
        const sessionId = getSessionId();
        const url = getApiUrl('/cart/items');

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                productId,
                variantId,
                quantity,
            }),
        });

        return handleResponse<{ success: boolean }>(response);
    },

    /**
     * Update item quantity
     */
    updateItem: async (cartId: string, variantId: string, quantity: number): Promise<{ success: boolean }> => {
        const url = getApiUrl(`/cart/items/${variantId}`);

        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId, quantity }),
        });

        return handleResponse<{ success: boolean }>(response);
    },

    /**
     * Remove item from cart
     */
    removeItem: async (cartId: string, variantId: string): Promise<{ success: boolean }> => {
        const url = getApiUrl(`/cart/items/${variantId}?cartId=${cartId}`);
        const response = await fetch(url, { method: 'DELETE' });
        return handleResponse<{ success: boolean }>(response);
    },
};

// === Checkout API ===
export interface CustomerInfo {
    name: string;
    email: string;
    phone?: string;
    address: string;
}

export const checkoutApi = {
    /**
     * Process checkout
     */
    process: async (cartId: string, customerInfo: CustomerInfo): Promise<{ success: boolean; orderId: string }> => {
        const url = getApiUrl('/checkout');

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId, customerInfo }),
        });

        return handleResponse<{ success: boolean; orderId: string }>(response);
    },
};

// === Order API ===
export const orderApi = {
    /**
     * Get order status (requires email verification)
     */
    getStatus: async (orderNumber: string, email: string): Promise<ApiOrder> => {
        const url = getApiUrl(`/orders/${orderNumber}?email=${encodeURIComponent(email)}`);
        const response = await fetch(url);
        return handleResponse<ApiOrder>(response);
    },
};

// === Utility Functions ===

/**
 * Convert price from cents to display format (GH₵)
 */
export const formatPrice = (priceInCents: number): string => {
    const priceInCedis = priceInCents / 100;
    return `GH₵${priceInCedis.toLocaleString()}`;
};

/**
 * Convert API product to frontend Product type
 */
export const toFrontendProduct = (apiProduct: ApiProduct) => ({
    id: apiProduct._id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    price: apiProduct.price / 100, // Convert cents to cedis
    description: apiProduct.description,
    image: apiProduct.images[0] || '',
    images: apiProduct.images,
    inStock: apiProduct.inStock,
    totalStock: apiProduct.totalStock,
    variants: apiProduct.variants,
    categoryName: apiProduct.categoryName,
});
