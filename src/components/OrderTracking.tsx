/**
 * Order Tracking Component
 * 
 * Look up order status using order number and email.
 */

import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle, Clock, AlertCircle, Loader2, Mail, Hash } from 'lucide-react';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { orderApi, ApiOrder } from '@/src/services/api';
import { OrderStatus } from '@/types';

// =====================================
// Order Status Timeline
// =====================================

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getStatusIndex = (status: OrderStatus): number => {
    const idx = statusSteps.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
};

interface OrderTimelineProps {
    currentStatus: OrderStatus;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
    const currentIdx = currentStatus === 'cancelled' ? -1 : getStatusIndex(currentStatus);

    if (currentStatus === 'cancelled') {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                    <p className="text-red-300 font-medium">Order Cancelled</p>
                    <p className="text-red-400/70 text-sm">This order has been cancelled</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {statusSteps.map((step, index) => {
                const isCompleted = index <= currentIdx;
                const isCurrent = index === currentIdx;
                const Icon = step.icon;

                return (
                    <div key={step.status} className="flex items-start gap-4 pb-6 last:pb-0">
                        {/* Connector Line */}
                        {index < statusSteps.length - 1 && (
                            <div
                                className={`absolute left-4 -translate-x-1/2 h-6 w-0.5 mt-10 ${index < currentIdx ? 'bg-green-500' : 'bg-white/10'
                                    }`}
                                style={{ top: `${index * 72 + 32}px` }}
                            />
                        )}

                        {/* Icon */}
                        <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                                    : 'bg-white/5 text-foreground-dim border-2 border-white/10'
                                } ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}
                        >
                            <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <p
                                className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-foreground-dim'
                                    }`}
                            >
                                {step.label}
                            </p>
                            {isCurrent && (
                                <p className="text-xs text-green-400 mt-0.5">Current status</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// =====================================
// Order Details View
// =====================================

interface OrderDetailsProps {
    order: ApiOrder;
    onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack }) => {
    const totalInCedis = order.totalAmount / 100;
    const createdDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <p className="text-xs text-primary uppercase tracking-widest mb-1">Order</p>
                <p className="text-lg font-mono text-foreground">{order.orderNumber}</p>
                <p className="text-sm text-foreground-dim mt-1">Placed on {createdDate}</p>
            </div>

            {/* Status Timeline */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-medium text-foreground-muted mb-4">Order Status</h3>
                <OrderTimeline currentStatus={order.status} />
            </div>

            {/* Order Items */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-medium text-foreground-muted mb-4">Items</h3>
                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <div>
                                <p className="text-foreground">{item.productName}</p>
                                {item.variantName && (
                                    <p className="text-foreground-dim text-xs">{item.variantName}</p>
                                )}
                                <p className="text-foreground-dim text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-foreground font-medium">
                                GH₵{(item.price / 100 * item.quantity).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-lg font-serif text-primary">GH₵{totalInCedis.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-sm text-foreground-muted">Payment</span>
                <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${order.paymentStatus === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : order.paymentStatus === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="w-full py-3 bg-white/5 border border-white/10 text-foreground-muted hover:text-foreground hover:bg-white/10 rounded-xl transition-all text-sm"
            >
                Track Another Order
            </button>
        </div>
    );
};

// =====================================
// Order Tracking Modal
// =====================================

export const OrderTracking: React.FC = () => {
    const { activeModal, closeTracking } = useModal();
    const { error: showError } = useToast();

    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [order, setOrder] = useState<ApiOrder | null>(null);
    const [searchError, setSearchError] = useState('');

    const isOpen = activeModal === 'tracking';

    // Handle search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError('');

        if (!orderNumber.trim() || !email.trim()) {
            setSearchError('Please enter both order number and email');
            return;
        }

        setIsSearching(true);

        try {
            const result = await orderApi.getStatus(orderNumber.trim(), email.trim());
            setOrder(result);
        } catch (err) {
            console.error('Order lookup error:', err);
            setSearchError('Order not found. Please check your order number and email.');
        } finally {
            setIsSearching(false);
        }
    };

    // Reset to search form
    const handleBack = () => {
        setOrder(null);
        setOrderNumber('');
        setEmail('');
        setSearchError('');
    };

    // Reset when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setOrder(null);
            setOrderNumber('');
            setEmail('');
            setSearchError('');
        }
    }, [isOpen]);

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
                onClick={closeTracking}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[1001] w-auto md:w-full md:max-w-md max-h-[90vh] bg-background border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Track Order"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-serif text-foreground">Track Your Order</h2>
                    </div>
                    <button
                        onClick={closeTracking}
                        className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {order ? (
                        <OrderDetails order={order} onBack={handleBack} />
                    ) : (
                        <form onSubmit={handleSearch} className="space-y-5">
                            <p className="text-foreground-muted text-sm text-center mb-6">
                                Enter your order number and email address to check your order status.
                            </p>

                            {/* Order Number Input */}
                            <div>
                                <label htmlFor="orderNumber" className="block text-sm font-medium text-foreground-muted mb-2">
                                    Order Number
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
                                    <input
                                        id="orderNumber"
                                        type="text"
                                        value={orderNumber}
                                        onChange={e => setOrderNumber(e.target.value)}
                                        placeholder="e.g. ORD-2026-001"
                                        className="w-full py-3 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground-dim focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="trackingEmail" className="block text-sm font-medium text-foreground-muted mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
                                    <input
                                        id="trackingEmail"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full py-3 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground-dim focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {searchError && (
                                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-red-300 text-sm">{searchError}</p>
                                </div>
                            )}

                            {/* Search Button */}
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="w-full py-4 bg-primary text-background-void font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-primary-light transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Track Order</span>
                                    </>
                                )}
                            </button>

                            {/* Help Text */}
                            <p className="text-center text-xs text-foreground-dim">
                                Can't find your order?{' '}
                                <a href="#contact" onClick={closeTracking} className="text-primary hover:underline">
                                    Contact us
                                </a>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderTracking;
