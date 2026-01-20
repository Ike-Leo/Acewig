/**
 * Cart Drawer Component
 * 
 * Slide-out drawer showing cart items, quantities, prices, and checkout CTA.
 * Matches dark luxury aesthetic with gold accents.
 */

import React from 'react';
import { X, ShoppingBag, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { useCartContext } from '@/src/contexts/CartContext';
import { QuantityPicker } from './QuantityPicker';

// =====================================
// Cart Item Component
// =====================================

interface CartItemRowProps {
    item: {
        _id: string;
        variantId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        maxStock: number;
        total: number;
    };
    onUpdateQuantity: (variantId: string, quantity: number) => Promise<boolean>;
    onRemove: (variantId: string) => Promise<boolean>;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const [updating, setUpdating] = React.useState(false);
    const [removing, setRemoving] = React.useState(false);

    const handleQuantityChange = async (quantity: number) => {
        setUpdating(true);
        await onUpdateQuantity(item.variantId, quantity);
        setUpdating(false);
    };

    const handleRemove = async () => {
        setRemoving(true);
        await onRemove(item.variantId);
        setRemoving(false);
    };

    // Convert price from cents to cedis for display
    const priceInCedis = item.price / 100;
    const totalInCedis = item.total / 100;

    return (
        <div className={`flex gap-4 py-4 border-b border-white/5 transition-opacity ${removing ? 'opacity-50' : ''}`}>
            {/* Product Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h4 className="text-foreground font-medium text-sm line-clamp-2 mb-1">
                    {item.name}
                </h4>
                <p className="text-primary text-sm font-serif mb-2">
                    GH₵{priceInCedis.toLocaleString()}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <QuantityPicker
                        quantity={item.quantity}
                        maxStock={item.maxStock}
                        onChange={handleQuantityChange}
                        loading={updating}
                        size="sm"
                        allowDecrease={false}
                    />

                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="p-2 text-foreground-dim hover:text-red-400 transition-colors disabled:opacity-50"
                        aria-label="Remove item"
                    >
                        {removing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Item Total */}
            <div className="text-right flex-shrink-0">
                <p className="text-foreground font-medium">
                    GH₵{totalInCedis.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

// =====================================
// Empty Cart State
// =====================================

const EmptyCart: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-serif text-foreground mb-2">Your Cart is Empty</h3>
        <p className="text-foreground-muted text-sm mb-6 max-w-[240px]">
            Looks like you haven't added any wigs to your collection yet.
        </p>
        <button
            onClick={onClose}
            className="px-6 py-3 bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-background-void transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-lg"
        >
            Start Shopping
        </button>
    </div>
);

// =====================================
// Cart Drawer Component
// =====================================

export const CartDrawer: React.FC = () => {
    const { activeModal, closeCart, openCheckout } = useModal();
    const { items, totalAmount, totalItems, updateItem, removeItem, loading } = useCartContext();
    const { error: showError } = useToast();

    const isOpen = activeModal === 'cart';

    // Convert total from cents to cedis
    const totalInCedis = totalAmount / 100;

    const handleUpdateQuantity = async (variantId: string, quantity: number) => {
        const success = await updateItem(variantId, quantity);
        if (!success) {
            showError('Failed to update quantity');
        }
        return success;
    };

    const handleRemove = async (variantId: string) => {
        const success = await removeItem(variantId);
        if (!success) {
            showError('Failed to remove item');
        }
        return success;
    };

    const handleCheckout = () => {
        closeCart();
        openCheckout();
    };

    // Prevent body scroll when drawer is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md z-[1001] bg-background border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping Cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-serif text-foreground">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <EmptyCart onClose={closeCart} />
                    ) : (
                        <div className="px-6 py-2">
                            {items.map(item => (
                                <CartItemRow
                                    key={item._id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Checkout */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 px-6 py-5 bg-background-card/50 backdrop-blur-md">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-foreground-muted">Subtotal</span>
                            <span className="text-xl font-serif text-primary">
                                GH₵{totalInCedis.toLocaleString()}
                            </span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-primary text-background-void font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-primary-light transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Continue Shopping */}
                        <button
                            onClick={closeCart}
                            className="w-full mt-3 py-3 text-foreground-muted hover:text-foreground text-sm transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
