/**
 * Custom React Hooks for Storefront API
 * 
 * These hooks provide a clean interface for components to fetch and manage
 * data from the Storefront API with proper loading and error states.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    productApi,
    categoryApi,
    cartApi,
    ApiProduct,
    ApiCategory,
    ApiCart,
    ApiError,
    toFrontendProduct,
} from './api';

// === Generic Fetch Hook ===
interface UseFetchState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => void;
}

function useFetch<T>(
    fetchFn: () => Promise<T>,
    deps: unknown[] = []
): UseFetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err instanceof ApiError ? err : new ApiError('Unknown error', 500));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
}

// === Product Hooks ===

export interface UseProductsOptions {
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    categorySlug?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
    const [cursor, setCursor] = useState<string | null>(null);
    const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { data, loading, error, refetch } = useFetch(
        () => productApi.list({ ...options, limit: options.limit || 12 }),
        [options.limit, options.minPrice, options.maxPrice, options.inStockOnly, options.categorySlug]
    );

    useEffect(() => {
        if (data) {
            setAllProducts(data.products);
            setCursor(data.nextCursor);
            setHasMore(data.hasMore);
        }
    }, [data]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore || !cursor) return;

        setLoadingMore(true);
        try {
            const result = await productApi.list({ ...options, cursor });
            setAllProducts(prev => [...prev, ...result.products]);
            setCursor(result.nextCursor);
            setHasMore(result.hasMore);
        } catch (err) {
            console.error('Failed to load more products:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [cursor, hasMore, loadingMore, options]);

    return {
        products: allProducts.map(toFrontendProduct),
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refetch,
    };
}

export function useProduct(slug: string) {
    const { data, loading, error, refetch } = useFetch(
        () => productApi.getBySlug(slug),
        [slug]
    );

    return {
        product: data ? toFrontendProduct(data) : null,
        variants: data?.variants || [],
        loading,
        error,
        refetch,
    };
}

export function useProductSearch(query: string, limit = 20) {
    const [results, setResults] = useState<ApiProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchProducts = async () => {
            setLoading(true);
            try {
                const data = await productApi.search(query, limit);
                setResults(data);
            } catch (err) {
                setError(err instanceof ApiError ? err : new ApiError('Search failed', 500));
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [query, limit]);

    return {
        results: results.map(toFrontendProduct),
        loading,
        error,
    };
}

export function useRelatedProducts(slug: string, limit = 4) {
    const { data, loading, error } = useFetch(
        () => productApi.getRelated(slug, limit),
        [slug, limit]
    );

    return {
        relatedProducts: (data || []).map(toFrontendProduct),
        loading,
        error,
    };
}

// === Category Hooks ===

export function useCategories() {
    const { data, loading, error, refetch } = useFetch<ApiCategory[]>(
        () => categoryApi.list(),
        []
    );

    return {
        categories: data || [],
        loading,
        error,
        refetch,
    };
}

export function useCategoryProducts(categorySlug: string, limit = 20) {
    const { data, loading, error } = useFetch(
        () => categoryApi.getProducts(categorySlug, limit),
        [categorySlug, limit]
    );

    return {
        products: (data || []).map(toFrontendProduct),
        loading,
        error,
    };
}

// === Cart Hook ===

export function useCart() {
    const [cart, setCart] = useState<ApiCart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const data = await cartApi.get();
            setCart(data);
        } catch (err) {
            setError(err instanceof ApiError ? err : new ApiError('Failed to load cart', 500));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = useCallback(async (productId: string, variantId: string, quantity = 1) => {
        setUpdating(true);
        try {
            await cartApi.addItem(productId, variantId, quantity);
            await fetchCart(); // Refresh cart
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err : new ApiError('Failed to add item', 500));
            return false;
        } finally {
            setUpdating(false);
        }
    }, [fetchCart]);

    const updateItem = useCallback(async (variantId: string, quantity: number) => {
        if (!cart) return false;

        setUpdating(true);
        try {
            await cartApi.updateItem(cart._id, variantId, quantity);
            await fetchCart();
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err : new ApiError('Failed to update item', 500));
            return false;
        } finally {
            setUpdating(false);
        }
    }, [cart, fetchCart]);

    const removeItem = useCallback(async (variantId: string) => {
        if (!cart) return false;

        setUpdating(true);
        try {
            await cartApi.removeItem(cart._id, variantId);
            await fetchCart();
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err : new ApiError('Failed to remove item', 500));
            return false;
        } finally {
            setUpdating(false);
        }
    }, [cart, fetchCart]);

    return {
        cart,
        items: cart?.items || [],
        totalItems: cart?.totalItems || 0,
        totalAmount: cart?.totalAmount || 0,
        loading,
        updating,
        error,
        addItem,
        updateItem,
        removeItem,
        refetch: fetchCart,
    };
}

// === Combined Store Hook (for App-level state) ===

export function useStore() {
    const products = useProducts({ limit: 12, inStockOnly: true });
    const categories = useCategories();
    const cart = useCart();

    return {
        products,
        categories,
        cart,
        isLoading: products.loading || categories.loading,
    };
}
