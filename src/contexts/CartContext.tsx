/**
 * Cart Context - Global Cart State Management
 * 
 * Provides cart state and actions to all components.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useCart } from '../services/hooks';
import { ApiCart, ApiCartItem } from '../services/api';

interface CartContextValue {
    cart: ApiCart | null;
    items: ApiCartItem[];
    totalItems: number;
    totalAmount: number;
    loading: boolean;
    updating: boolean;
    error: Error | null;
    addItem: (productId: string, variantId: string, quantity?: number) => Promise<boolean>;
    updateItem: (variantId: string, quantity: number) => Promise<boolean>;
    removeItem: (variantId: string) => Promise<boolean>;
    refetch: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const cartState = useCart();

    return (
        <CartContext.Provider value={cartState}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}
