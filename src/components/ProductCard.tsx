import React, { useState } from 'react';
import { ShoppingCart, Loader2, Heart } from 'lucide-react';
import { Product } from '../types'; // Adjust path as needed, likely ../../types or @/types

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onQuickView,
    onToggleWishlist,
    isInWishlist = false
}) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening quick view
        if (onAddToCart) {
            setIsAdding(true);
            await onAddToCart(product); // Assuming onAddToCart might be async or we just want to show loader for a bit
            setTimeout(() => setIsAdding(false), 500);
        }
    };

    const handleCardClick = () => {
        if (onQuickView) {
            onQuickView(product);
        }
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleWishlist) {
            onToggleWishlist(product);
        }
    };

    return (
        <div
            className="group relative flex flex-col items-center cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Card Body */}
            <div className="w-full aspect-[4/5] bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.3)] overflow-hidden relative isolate">

                {/* Image - Fills the card fully */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay for Text Readability - Minimal at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none z-10"></div>

                {/* Sale/New Badge */}
                {product.isNew && (
                    <div className="absolute top-4 left-4 z-20 bg-primary text-black text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                        New
                    </div>
                )}
                {product.originalPrice && (
                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}

                {/* Wishlist Button */}
                {onToggleWishlist && (
                    <button
                        onClick={handleWishlistClick}
                        className={`absolute top-4 ${product.isNew ? 'right-4' : 'left-4'} z-40 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isInWishlist ? 'bg-primary text-background-void' : 'bg-black/30 text-white hover:bg-white/20'}`}
                    >
                        <Heart className="w-4 h-4" fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                )}

                {/* Out of Stock Badge */}
                {product.inStock === false && (
                    <div className="absolute top-4 left-4 z-20 bg-red-900/80 text-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                        Out of Stock
                    </div>
                )}

                {/* Quick View / Add to Cart Button - Positioned in center, fades in */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-black/20 backdrop-blur-[2px]">
                    <div className="flex flex-col gap-2 scale-90 md:scale-100">
                        {/* View Details Button */}
                        <button
                            onClick={handleCardClick}
                            className="px-6 py-3 bg-white/90 text-black text-sm font-bold rounded-full hover:bg-white transition-all hover:scale-105 shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                            View Details
                        </button>

                        {/* Quick Add Button - Only for in-stock items */}
                        {product.inStock !== false && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="px-6 py-2 bg-primary/90 text-black text-xs font-bold rounded-full hover:bg-primary transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-3 h-3" />
                                        <span>Quick Add</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Product Name & Price Info - Clean, floating at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-center z-20">
                    <h3 className="text-white font-serif text-sm md:text-base font-medium mb-1 drop-shadow-md line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-lg group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                            <span className="text-primary-light font-serif text-base md:text-xl font-bold">GH₵{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-white/50 text-xs line-through decoration-white/30">GH₵{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
