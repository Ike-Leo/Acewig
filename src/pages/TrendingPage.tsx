import React from 'react';
import { useProducts } from '@/src/services/hooks';
import { ProductCard } from '@/src/components/ProductCard';
import { useCartContext } from '@/src/contexts/CartContext';
import { useModal, useToast } from '@/src/contexts/AppContext';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { Loader2, TrendingUp } from 'lucide-react';

const TrendingPage = () => {
    // Determine number of columns based on user request (though standard grid is fine here, user specifically asked for mobile featured products to be smaller, likely meaning homepage. But consistent design is good).
    // Let's stick to standard responsive grid for dedicated page.

    const { products, loading } = useProducts({ limit: 12, inStockOnly: true });

    // Hooks for interactions
    const { addItem } = useCartContext();
    const { openQuickView } = useModal();
    const { success: showSuccess, error: showError } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();

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
                        <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-primary-light mb-4">Trending Now</h1>
                    <p className="text-foreground-muted font-sans max-w-xl mx-auto">
                        See what everyone is craving. These represent our most ordered styles this week.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-12">
                        {products.map(product => (
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

export default TrendingPage;
