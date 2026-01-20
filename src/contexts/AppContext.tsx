/**
 * App Context - Global Application State Management
 * 
 * Manages modals, selected products, toasts, and UI state.
 */

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Product, ProductVariant, Toast, ToastType, ModalType, AppState } from '@/types';

// =====================================
// State & Actions
// =====================================

type AppAction =
    | { type: 'OPEN_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'OPEN_QUICKVIEW'; product: Product }
    | { type: 'CLOSE_QUICKVIEW' }
    | { type: 'SELECT_VARIANT'; variant: ProductVariant | null }
    | { type: 'OPEN_CHECKOUT' }
    | { type: 'CLOSE_CHECKOUT' }
    | { type: 'OPEN_CONFIRMATION'; orderId: string }
    | { type: 'CLOSE_CONFIRMATION' }
    | { type: 'OPEN_TRACKING' }
    | { type: 'CLOSE_TRACKING' }
    | { type: 'CLOSE_ALL_MODALS' }
    | { type: 'ADD_TOAST'; toast: Toast }
    | { type: 'REMOVE_TOAST'; id: string };

const initialState: AppState = {
    activeModal: null,
    selectedProduct: null,
    selectedVariant: null,
    lastOrderId: null,
    toasts: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'OPEN_CART':
            return { ...state, activeModal: 'cart' };
        case 'CLOSE_CART':
            return { ...state, activeModal: null };
        case 'OPEN_QUICKVIEW':
            return {
                ...state,
                activeModal: 'quickview',
                selectedProduct: action.product,
                selectedVariant: action.product.variants?.find(v => v.isDefault) || action.product.variants?.[0] || null
            };
        case 'CLOSE_QUICKVIEW':
            return { ...state, activeModal: null, selectedProduct: null, selectedVariant: null };
        case 'SELECT_VARIANT':
            return { ...state, selectedVariant: action.variant };
        case 'OPEN_CHECKOUT':
            return { ...state, activeModal: 'checkout' };
        case 'CLOSE_CHECKOUT':
            return { ...state, activeModal: null };
        case 'OPEN_CONFIRMATION':
            return { ...state, activeModal: 'confirmation', lastOrderId: action.orderId };
        case 'CLOSE_CONFIRMATION':
            return { ...state, activeModal: null, lastOrderId: null };
        case 'OPEN_TRACKING':
            return { ...state, activeModal: 'tracking' };
        case 'CLOSE_TRACKING':
            return { ...state, activeModal: null };
        case 'CLOSE_ALL_MODALS':
            return { ...state, activeModal: null, selectedProduct: null, selectedVariant: null };
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, action.toast] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
        default:
            return state;
    }
}

// =====================================
// Context & Provider
// =====================================

interface AppContextValue {
    state: AppState;
    // Modal actions
    openCart: () => void;
    closeCart: () => void;
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
    selectVariant: (variant: ProductVariant | null) => void;
    openCheckout: () => void;
    closeCheckout: () => void;
    openConfirmation: (orderId: string) => void;
    closeConfirmation: () => void;
    openTracking: () => void;
    closeTracking: () => void;
    closeAllModals: () => void;
    // Toast actions
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
    const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
    const openQuickView = useCallback((product: Product) => dispatch({ type: 'OPEN_QUICKVIEW', product }), []);
    const closeQuickView = useCallback(() => dispatch({ type: 'CLOSE_QUICKVIEW' }), []);
    const selectVariant = useCallback((variant: ProductVariant | null) => dispatch({ type: 'SELECT_VARIANT', variant }), []);
    const openCheckout = useCallback(() => dispatch({ type: 'OPEN_CHECKOUT' }), []);
    const closeCheckout = useCallback(() => dispatch({ type: 'CLOSE_CHECKOUT' }), []);
    const openConfirmation = useCallback((orderId: string) => dispatch({ type: 'OPEN_CONFIRMATION', orderId }), []);
    const closeConfirmation = useCallback(() => dispatch({ type: 'CLOSE_CONFIRMATION' }), []);
    const openTracking = useCallback(() => dispatch({ type: 'OPEN_TRACKING' }), []);
    const closeTracking = useCallback(() => dispatch({ type: 'CLOSE_TRACKING' }), []);
    const closeAllModals = useCallback(() => dispatch({ type: 'CLOSE_ALL_MODALS' }), []);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast: Toast = { id, type, message, duration };
        dispatch({ type: 'ADD_TOAST', toast });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                dispatch({ type: 'REMOVE_TOAST', id });
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_TOAST', id });
    }, []);

    return (
        <AppContext.Provider
            value={{
                state,
                openCart,
                closeCart,
                openQuickView,
                closeQuickView,
                selectVariant,
                openCheckout,
                closeCheckout,
                openConfirmation,
                closeConfirmation,
                openTracking,
                closeTracking,
                closeAllModals,
                showToast,
                removeToast,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

// Convenience hooks
export function useModal() {
    const { state, openCart, closeCart, openQuickView, closeQuickView, selectVariant, openCheckout, closeCheckout, openConfirmation, closeConfirmation, openTracking, closeTracking, closeAllModals } = useAppContext();
    return {
        activeModal: state.activeModal,
        selectedProduct: state.selectedProduct,
        selectedVariant: state.selectedVariant,
        lastOrderId: state.lastOrderId,
        openCart,
        closeCart,
        openQuickView,
        closeQuickView,
        selectVariant,
        openCheckout,
        closeCheckout,
        openConfirmation,
        closeConfirmation,
        openTracking,
        closeTracking,
        closeAllModals,
    };
}

export function useToast() {
    const { state, showToast, removeToast } = useAppContext();
    return {
        toasts: state.toasts,
        showToast,
        removeToast,
        success: (message: string) => showToast('success', message),
        error: (message: string) => showToast('error', message),
        info: (message: string) => showToast('info', message),
        warning: (message: string) => showToast('warning', message),
    };
}
