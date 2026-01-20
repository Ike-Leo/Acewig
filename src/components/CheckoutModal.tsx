/**
 * Checkout Modal Component
 * 
 * Customer info form, cart summary, and order placement.
 */

import React, { useState } from 'react';
import { X, CreditCard, User, Mail, Phone, MapPin, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { useCartContext } from '@/src/contexts/CartContext';
import { checkoutApi, CustomerInfo } from '@/src/services/api';

// =====================================
// Form Input Component
// =====================================

interface FormInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    icon?: React.ElementType;
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    icon: Icon,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-foreground-muted mb-2">
            {label} {required && <span className="text-primary">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className={`w-full py-3 ${Icon ? 'pl-11' : 'px-4'} pr-4 bg-white/5 border rounded-xl text-foreground placeholder:text-foreground-dim focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all ${error ? 'border-red-500/50' : 'border-white/10'
                    }`}
            />
        </div>
        {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
    </div>
);

// =====================================
// Cart Summary Component
// =====================================

const CartSummary: React.FC = () => {
    const { items, totalAmount } = useCartContext();
    const totalInCedis = totalAmount / 100;

    return (
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-lg font-serif text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
            </h3>

            <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3 text-sm">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                            <img
                                src={item.image || '/placeholder-product.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground truncate">{item.name}</p>
                            <p className="text-foreground-dim text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-foreground font-medium">
                            GH₵{(item.total / 100).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Subtotal</span>
                    <span className="text-foreground">GH₵{totalInCedis.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Delivery</span>
                    <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-xl font-serif text-primary">GH₵{totalInCedis.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

// =====================================
// Checkout Modal Component
// =====================================

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export const CheckoutModal: React.FC = () => {
    const { activeModal, closeCheckout, openConfirmation } = useModal();
    const { cart, items, refetch } = useCartContext();
    const { success: showSuccess, error: showError } = useToast();

    const [formData, setFormData] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const isOpen = activeModal === 'checkout';

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Delivery address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) return;
        if (!cart?._id) {
            showError('Cart not found');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await checkoutApi.process(cart._id, formData);

            if (result.success) {
                showSuccess('Order placed successfully!');

                // Clear form
                setFormData({ name: '', email: '', phone: '', address: '' });

                // Close checkout and open confirmation
                closeCheckout();
                openConfirmation(result.orderId);

                // Refresh cart (should be empty now)
                refetch();
            } else {
                setSubmitError('Failed to process order. Please try again.');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update form field
    const updateField = (field: keyof CustomerInfo) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
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

    if (items.length === 0 && isOpen) {
        closeCheckout();
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeCheckout}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[1001] w-auto md:w-full md:max-w-3xl max-h-[90vh] bg-background border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Checkout"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-serif text-foreground">Checkout</h2>
                    </div>
                    <button
                        onClick={closeCheckout}
                        className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left - Customer Info Form */}
                            <div className="space-y-5">
                                <h3 className="text-lg font-serif text-foreground mb-4">
                                    Delivery Information
                                </h3>

                                <FormInput
                                    id="name"
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={updateField('name')}
                                    placeholder="Enter your full name"
                                    required
                                    error={errors.name}
                                    icon={User}
                                />

                                <FormInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={updateField('email')}
                                    placeholder="you@example.com"
                                    required
                                    error={errors.email}
                                    icon={Mail}
                                />

                                <FormInput
                                    id="phone"
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={updateField('phone')}
                                    placeholder="+233 XXX XXX XXX"
                                    error={errors.phone}
                                    icon={Phone}
                                />

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-foreground-muted mb-2">
                                        Delivery Address <span className="text-primary">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-foreground-dim" />
                                        <textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={e => updateField('address')(e.target.value)}
                                            placeholder="Enter your full delivery address"
                                            required
                                            rows={3}
                                            className={`w-full py-3 pl-11 pr-4 bg-white/5 border rounded-xl text-foreground placeholder:text-foreground-dim focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none ${errors.address ? 'border-red-500/50' : 'border-white/10'
                                                }`}
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                                    )}
                                </div>
                            </div>

                            {/* Right - Order Summary */}
                            <div>
                                <h3 className="text-lg font-serif text-foreground mb-4">
                                    Your Order
                                </h3>
                                <CartSummary />
                            </div>
                        </div>

                        {/* Error Message */}
                        {submitError && (
                            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-300 text-sm">{submitError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-6 py-4 bg-primary text-background-void font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-primary-light transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    <span>Place Order</span>
                                </>
                            )}
                        </button>

                        {/* Payment Note */}
                        <p className="mt-4 text-center text-xs text-foreground-dim">
                            Pay on Delivery • Free Delivery in Accra • 2-3 Working Days
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CheckoutModal;
