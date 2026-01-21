import React from 'react';
import { ProductCard } from '@/src/components/ProductCard';
import { useCartContext } from '@/src/contexts/CartContext';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useCartContext();
    const { openQuickView } = useModal();
    const { success: showSuccess, error: showError } = useToast();

    const handleAddToCart = async (product: any) => {
        if (product.variants && product.variants.length > 1) {
            openQuickView(product);
            return;
        }
        const productId = String(product.id);
        const variantId = product.variants?.[0]?._id || productId;
        const success = await addItem(productId, variantId);
        if (success) showSuccess(`Added ${product.name} to cart!`);
        else showError('Failed to add item to cart');
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-primary-light mb-4">Your Wishlist</h1>
                    <p className="text-foreground-muted font-sans max-w-xl mx-auto">
                        Save your favorites for later.
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-8 h-8 text-foreground-dim" />
                        </div>
                        <h2 className="text-xl font-serif text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-foreground-muted mb-8">Start exploring and save your favorite styles.</p>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-12">
                        {wishlistItems.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onQuickView={openQuickView}
                                onToggleWishlist={toggleWishlist}
                                isInWishlist={isInWishlist(product.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
