/**
 * Order Confirmation Component
 * 
 * Shows order success with order number and next steps.
 */

import React from 'react';
import { CheckCircle, Package, Truck, Clock, X, ShoppingBag, Search } from 'lucide-react';
import { useModal } from '@/src/contexts/AppContext';

// =====================================
// Order Confirmation Modal
// =====================================

export const OrderConfirmation: React.FC = () => {
    const { activeModal, lastOrderId, closeConfirmation, openTracking, closeAllModals } = useModal();

    const isOpen = activeModal === 'confirmation';

    const handleTrackOrder = () => {
        closeConfirmation();
        setTimeout(() => openTracking(), 100);
    };

    const handleContinueShopping = () => {
        closeAllModals();
    };

    // Prevent body scroll when modal is open
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
                className={`fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeConfirmation}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[1001] w-auto md:w-full md:max-w-md bg-background border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Order Confirmation"
            >
                {/* Close Button */}
                <button
                    onClick={closeConfirmation}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 text-foreground-muted hover:bg-white/10 hover:text-foreground transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    {/* Success Icon */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                        <div className="relative w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                        Order Confirmed!
                    </h2>
                    <p className="text-foreground-muted mb-6">
                        Thank you for shopping with Ace Wig. Your order has been received and is being processed.
                    </p>

                    {/* Order Number */}
                    {lastOrderId && (
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                            <p className="text-xs text-primary uppercase tracking-widest mb-1">
                                Order Number
                            </p>
                            <p className="text-lg font-mono text-foreground font-medium">
                                {lastOrderId}
                            </p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white/5 rounded-2xl p-5 mb-6">
                        <h3 className="text-sm font-medium text-foreground-muted mb-4 text-left">
                            What happens next?
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">Order Processing</p>
                                    <p className="text-xs text-foreground-dim">We're preparing your order</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Truck className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">Delivery</p>
                                    <p className="text-xs text-foreground-dim">2-3 working days in Accra</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-foreground-dim" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">Pay on Delivery</p>
                                    <p className="text-xs text-foreground-dim">Pay when you receive your order</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleTrackOrder}
                            className="w-full py-3 bg-white/5 border border-white/10 text-foreground font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            <span>Track Your Order</span>
                        </button>
                        <button
                            onClick={handleContinueShopping}
                            className="w-full py-4 bg-primary text-background-void font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-primary-light transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderConfirmation;
