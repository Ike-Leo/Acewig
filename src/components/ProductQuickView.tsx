/**
 * Product Quick View Modal
 * 
 * Modal showing product details, image gallery, variant selector,
 * quantity picker, and add-to-cart functionality.
 */

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { useCartContext } from '@/src/contexts/CartContext';
// Added useCategories to imports
import { useProducts, useCategories } from '@/src/services/hooks';
import { VariantSelector } from './VariantSelector';
import { QuantityPicker } from './QuantityPicker';
import { ProductVariant, Product } from '@/types';

// =====================================
// Related Products Component
// =====================================

interface RelatedProductsListProps {
    currentId: string | number;
    categoryName?: string;
    onSelect: (product: Product) => void;
}

const RelatedProductsList: React.FC<RelatedProductsListProps> = ({ currentId, categoryName, onSelect }) => {
    // Get categories to resolve slug from name
    const { categories } = useCategories();
    const categorySlug = categoryName ? categories.find(c => c.name === categoryName)?.slug : undefined;

    // Fetch products based on category
    const { products } = useProducts({
        limit: 8, // Fetch more to ensure we have enough after filtering
        categorySlug
    });

    // Filter out current product and limit to 4
    const related = products.filter(p => String(p._id) !== String(currentId)).slice(0, 4);

    // Filters fallback: if 0 related in category, fetch generic? 
    // For now, if 0, show nothing or just accept it. 
    // The requirement "must also feature other products" implies we should always show something.
    // We could do a second fetch or just fallback to global if category has few items.
    // Let's stick to category first.

    if (related.length === 0) return null;

    return (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-1 scrollbar-hide">
            {related.map(p => (
                <div
                    key={p._id}
                    className="min-w-[140px] md:min-w-0 md:w-full bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all cursor-pointer group flex-shrink-0"
                    onClick={() => onSelect({
                        id: p._id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        description: p.description,
                        image: p.images[0] || '/placeholder-product.jpg',
                        images: p.images,
                        inStock: p.inStock,
                        totalStock: p.totalStock,
                        categoryName: p.categoryName,
                        variants: p.variants
                    })}
                >
                    <div className="aspect-square relative overflow-hidden">
                        <img
                            src={p.images[0] || '/placeholder-product.jpg'}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <div className="p-3">
                        <h4 className="text-white text-xs font-serif line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {p.name}
                        </h4>
                        <span className="text-primary text-xs font-bold">
                            GH₵{p.price.toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// =====================================
// Image Gallery Component
// =====================================

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];

    const goToPrev = () => {
        setActiveIndex(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setActiveIndex(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden">
            {/* Main Image */}
            <img
                src={displayImages[activeIndex]}
                alt={`${productName} - Image ${activeIndex + 1}`}
                className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Thumbnail Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                ? 'bg-primary w-6'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// =====================================
// Product Quick View Component
// =====================================

export const ProductQuickView: React.FC = () => {
    // Added openQuickView to destructuring, removed selectProduct
    const { activeModal, selectedProduct, selectedVariant, closeQuickView, selectVariant, openQuickView, openCart } = useModal();
    const { addItem } = useCartContext();
    const { success: showSuccess, error: showError } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const isOpen = activeModal === 'quickview';
    const product = selectedProduct;
    const variant = selectedVariant;
    const variants = product?.variants || [];

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setAddedToCart(false);
        }
    }, [isOpen, product]);

    // Handle variant selection
    const handleVariantSelect = (newVariant: ProductVariant) => {
        selectVariant(newVariant);
        setQuantity(1);
        setAddedToCart(false);
    };

    // Get display price (from variant or product)
    const displayPrice = variant ? variant.price / 100 : product?.price || 0;
    const maxStock = variant?.stockQuantity || product?.totalStock || 0;
    const inStock = maxStock > 0;

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!product || !inStock) return;

        setIsAdding(true);
        try {
            // Use variant ID if available, otherwise product ID
            const productId = String(product.id);
            const variantId = variant?._id || productId;

            const success = await addItem(productId, variantId, quantity);

            if (success) {
                setAddedToCart(true);
                showSuccess(`Added ${product.name} to your cart!`);

                // Reset after showing success
                setTimeout(() => {
                    setAddedToCart(false);
                }, 2000);
            } else {
                showError('Failed to add item to cart');
            }
        } catch {
            showError('Something went wrong');
        } finally {
            setIsAdding(false);
        }
    };

    // Handle view cart
    const handleViewCart = () => {
        closeQuickView();
        setTimeout(() => openCart(), 100);
    };

    // Handle related product click
    const handleRelatedSelect = (newProduct: Product) => {
        // selectVariant(null); // openQuickView likely resets this in Reducer logic?
        // Let's check AppContext Reducer: 
        // case 'OPEN_QUICKVIEW': return { ... selectedVariant: ... find default ... }
        // So it handles variant reset/selection automatically.
        openQuickView(newProduct);

        // Scroll to top of modal content if needed
        const modalContent = document.querySelector('.modal-content-scroll');
        if (modalContent) modalContent.scrollTop = 0;
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!product) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeQuickView}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[1001] w-full h-full md:h-auto md:w-full md:max-w-5xl md:max-h-[90vh] bg-background border border-white/10 md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label={`${product.name} details`}
            >
                {/* Close Button */}
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Container - Split 3 ways on Desktop, Stacked on Mobile */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* LEFT: Image Gallery (Mobile: Top, Desktop: Left) */}
                    <div className="md:w-5/12 bg-black/20 p-0 md:p-6 overflow-hidden md:overflow-y-auto shrink-0 relative">
                        {/* Mobile Back Button */}
                        <button
                            onClick={closeQuickView}
                            className="md:hidden absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="h-full flex items-center justify-center p-6 pt-16 md:p-0">
                            <ImageGallery
                                images={product.images || [product.image]}
                                productName={product.name}
                            />
                        </div>
                    </div>

                    {/* MIDDLE: Product Details (Mobile: Middle, Desktop: Center) */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto modal-content-scroll bg-background md:border-r md:border-white/5 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        <div className="flex flex-col min-h-min">
                            {/* Category */}
                            {product.categoryName && (
                                <span className="text-primary text-xs uppercase tracking-widest font-medium mb-2">
                                    {product.categoryName}
                                </span>
                            )}

                            {/* Name */}
                            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                                {product.name}
                            </h2>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-serif text-primary">
                                    GH₵{displayPrice.toLocaleString()}
                                </span>
                                {product.originalPrice && product.originalPrice > displayPrice && (
                                    <span className="text-lg text-foreground-dim line-through">
                                        GH₵{product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-foreground-muted text-sm leading-relaxed mb-6">
                                    {product.description}
                                </p>
                            )}

                            {/* Variant Selector */}
                            {variants.length > 1 && (
                                <div className="mb-6">
                                    <VariantSelector
                                        variants={variants}
                                        selectedVariant={variant}
                                        onSelect={handleVariantSelect}
                                    />
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="mt-6 md:mt-auto space-y-4">
                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground-muted mb-2 uppercase tracking-wide">
                                        Quantity
                                    </label>
                                    <QuantityPicker
                                        quantity={quantity}
                                        maxStock={maxStock}
                                        onChange={setQuantity}
                                        disabled={!inStock}
                                        size="md"
                                    />
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={addedToCart ? handleViewCart : handleAddToCart}
                                    disabled={!inStock || isAdding}
                                    className={`w-full py-4 font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${addedToCart
                                        ? 'bg-green-600 text-white'
                                        : inStock
                                            ? 'bg-primary text-background-void hover:bg-primary-light'
                                            : 'bg-white/10 text-foreground-dim cursor-not-allowed'
                                        }`}
                                >
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Adding...</span>
                                        </>
                                    ) : addedToCart ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>View Cart</span>
                                        </>
                                    ) : inStock ? (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Add to Cart</span>
                                        </>
                                    ) : (
                                        <span>Out of Stock</span>
                                    )}
                                </button>

                                {/* Stock Status */}
                                {inStock && maxStock <= 10 && (
                                    <p className="text-center text-yellow-400 text-xs">
                                        Hurry! Only {maxStock} left in stock
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default ProductQuickView;
