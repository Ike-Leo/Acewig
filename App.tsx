import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Star, MapPin, Phone, Clock, Instagram, MessageCircle, Sparkles, Scissors, Truck, Loader2, Globe, Mail } from 'lucide-react';
import { Product, Review } from '@/types';
import { useProducts, useCategories } from '@/src/services/hooks';
import { CartProvider, useCartContext } from '@/src/contexts/CartContext';
import { AppProvider, useModal, useToast } from '@/src/contexts/AppContext';
import HeroScrollAnimation from '@/src/components/HeroScrollAnimation';
import { SearchBar } from '@/src/components/SearchBar';
import { CartDrawer } from '@/src/components/CartDrawer';
import { ProductQuickView } from '@/src/components/ProductQuickView';
import { CheckoutModal } from '@/src/components/CheckoutModal';
import { OrderConfirmation } from '@/src/components/OrderConfirmation';
import { OrderTracking } from '@/src/components/OrderTracking';
import { ToastContainer } from '@/src/components/Toast';
import { CategoryNav, FilterChips } from '@/src/components/CategoryNav';
import { ProductGridSkeleton } from '@/src/components/Skeleton';

// --- Constants & Data ---

// Fallback products (used when API is unavailable)
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'SDD Fringe Bob',
    price: 499,
    originalPrice: 580,
    description: '8" Super Double Drawn with bangs',
    image: 'https://images.unsplash.com/photo-1595476103518-871a2963ad25?auto=format&fit=crop&q=80&w=600',
    isNew: true,
  },
  {
    id: 2,
    name: 'Vietnamese SDD 5×5',
    price: 1600,
    originalPrice: 1800,
    description: '18" Vietnamese straight, 250g',
    image: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    name: 'DD Bouncy Fringe',
    price: 699,
    originalPrice: 799,
    description: '12" Double Drawn curls, 200g',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    name: 'Raw Vietnamese Bouncy',
    price: 1050,
    originalPrice: 1200,
    description: '14" Raw Vietnamese waves',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600',
    isNew: true,
  },
  {
    id: 5,
    name: 'SDD Pixie Band Wig',
    price: 1300,
    originalPrice: 1500,
    description: 'Super Double Drawn pixie cut',
    image: 'https://images.unsplash.com/photo-1574351657802-99525cf18b57?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6,
    name: 'Luxury Deep Wave',
    price: 1400,
    originalPrice: 1600,
    description: 'Raw Hair SDD, 250g',
    image: 'https://images.unsplash.com/photo-1595476103518-871a2963ad25?auto=format&fit=crop&q=80&w=600',
  },
];

const REVIEWS: Review[] = [
  {
    id: 1,
    rating: 5,
    title: 'Won Me for Life',
    text: "Girl, you're the CHIC! It's so beautiful—you've won me for life. ❤️",
    author: 'Happy Customer',
    source: 'Instagram DM',
  },
  {
    id: 2,
    rating: 5,
    title: 'Worth the Wait',
    text: "Affordable luxury indeed! The quality is amazing and the service at North Legon was top notch. 2-3 days delivery, totally worth it!",
    author: 'Loyal Client',
    source: 'Google Review',
  },
  {
    id: 3,
    rating: 5,
    title: 'Premium Quality',
    text: "This isn't just hair—it's 100% raw Vietnamese, super double drawn. The kind of quality you can touch, see, and slay in. ✨",
    author: 'Ama K.',
    source: 'Instagram',
  },
];

// --- Components ---

const Hero = () => {
  return (
    <HeroScrollAnimation>
      {/* Text Overlay - Everything is now FIXED via parent */}
      <div className="relative h-screen flex items-start pt-28 md:pt-32 lg:pt-40">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight text-foreground drop-shadow-2xl mb-4 md:mb-6">
              Ace Wig <br />
              <span className="text-foreground">Salon</span> <span className="italic font-normal">&</span> <br />
              <span className="text-primary italic">Luxe Shop</span>
            </h1>

            <div className="border-l-2 border-primary/30 pl-4 md:pl-6 py-2 mb-6 md:mb-8">
              <p className="text-foreground-muted font-sans text-base md:text-lg max-w-sm md:max-w-md leading-relaxed">
                Affordable Luxury at Your Fingertips. Custom wigs, professional styling, and premium care in North Legon.
              </p>
            </div>

            <div className="flex items-center space-x-8 md:space-x-12 mb-6 md:mb-8">
              <div>
                <span className="block text-2xl md:text-3xl font-serif text-primary-light">9k+</span>
                <span className="text-[10px] md:text-xs text-foreground-dim uppercase tracking-widest">Styles Created</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-serif text-primary-light">36k+</span>
                <span className="text-[10px] md:text-xs text-foreground-dim uppercase tracking-widest">Happy Clients</span>
              </div>
            </div>

            <a
              href="#shop"
              className="inline-block px-6 md:px-8 py-3 md:py-4 bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-background-void transition-all duration-300 uppercase tracking-widest text-xs md:text-sm font-bold"
            >
              Book Appointment
            </a>
          </div>
        </div>

        {/* Shop Now Badge */}
        <div className="absolute bottom-10 right-6 md:bottom-20 md:right-12">
          <a
            href="#shop"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/10 bg-background-void/60 backdrop-blur-md flex flex-col items-center justify-center text-center group hover:scale-110 transition-transform duration-300 shadow-2xl"
          >
            <span className="font-serif text-primary uppercase text-xs md:text-sm tracking-widest leading-none mb-1 group-hover:text-foreground transition-colors">Shop</span>
            <span className="font-serif text-foreground uppercase text-[10px] md:text-xs tracking-widest leading-none">Now</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-foreground-dim text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-6 h-10 border-2 border-foreground-dim/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gradient fade at bottom for smooth transition */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-40"></div>
    </HeroScrollAnimation>
  );
};

// Product Card Component - Opens Quick View Modal
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening quick view
    if (onAddToCart) {
      setIsAdding(true);
      onAddToCart(product);
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group relative flex flex-col items-center cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Card Body */}
      <div className="w-full aspect-[4/5] bg-background-card/20 rounded-[2.5rem] border border-white/5 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-gold overflow-hidden relative isolate">

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
          <div className="absolute top-4 left-4 z-20 bg-primary text-background-void text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
            New
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.inStock === false && (
          <div className="absolute top-4 left-4 z-20 bg-red-900/80 text-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
            Out of Stock
          </div>
        )}

        {/* Quick View / Add to Cart Button - Positioned in center, fades in */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-black/20 backdrop-blur-[2px]">
          <div className="flex flex-col gap-2">
            {/* View Details Button */}
            <button
              onClick={handleCardClick}
              className="px-6 py-3 bg-white/90 text-background-void text-sm font-bold rounded-full hover:bg-white transition-all hover:scale-105 shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-300"
            >
              View Details
            </button>

            {/* Quick Add Button - Only for in-stock items */}
            {product.inStock !== false && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="px-6 py-2 bg-primary/90 text-background-void text-xs font-bold rounded-full hover:bg-primary transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
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
        <div className="absolute bottom-0 left-0 right-0 p-5 text-center z-20">
          <h3 className="text-white font-serif text-sm md:text-base font-medium mb-1 drop-shadow-md line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-lg group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
              <span className="text-primary-light font-serif text-lg md:text-xl font-bold">GH₵{product.price.toLocaleString()}</span>
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

// Shop Section - With API Integration, Quick View, and Filters
const ShopSection = () => {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch products with filters
  const { products: apiProducts, loading, error, hasMore, loadMore, loadingMore } = useProducts({
    limit: 6,
    inStockOnly,
    categorySlug: selectedCategory || undefined
  });

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  // Fetch categories for filter dropdown
  const { categories } = useCategories();

  // Use API products if available, otherwise use fallback
  const products: Product[] = apiProducts.length > 0 ? apiProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    description: p.description || '',
    image: p.image || 'https://images.unsplash.com/photo-1595476103518-871a2963ad25?auto=format&fit=crop&q=80&w=600',
    images: p.images,
    isNew: false,
    originalPrice: undefined,
    inStock: p.inStock,
    totalStock: p.totalStock,
    variants: p.variants,
  })) : (selectedCategory || inStockOnly ? [] : FALLBACK_PRODUCTS);

  // Get cart context and modal controls
  let addToCart: ((productId: string, variantId: string) => Promise<boolean>) | undefined;
  let openQuickView: ((product: Product) => void) | undefined;
  let showSuccess: ((message: string) => void) | undefined;
  let showError: ((message: string) => void) | undefined;

  try {
    const cartContext = useCartContext();
    addToCart = cartContext.addItem;
  } catch {
    // Cart not available
  }

  try {
    const modalContext = useModal();
    openQuickView = modalContext.openQuickView;
  } catch {
    // Modal not available
  }

  try {
    const toastContext = useToast();
    showSuccess = toastContext.success;
    showError = toastContext.error;
  } catch {
    // Toast not available
  }

  const handleAddToCart = async (product: Product) => {
    if (addToCart) {
      // If product has variants, open quick view instead
      if (product.variants && product.variants.length > 1 && openQuickView) {
        openQuickView(product);
        return;
      }

      // Use first variant or product ID
      const productId = String(product.id);
      const variantId = product.variants?.[0]?._id || productId;

      const success = await addToCart(productId, variantId);
      if (success) {
        showSuccess?.(`Added ${product.name} to cart!`);
      } else {
        showError?.('Failed to add item to cart');
      }
    }
  };

  const handleQuickView = (product: Product) => {
    if (openQuickView) {
      openQuickView(product);
    }
  };

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.slug === selectedCategory)?.name
    : undefined;

  const hasFilters = selectedCategory || inStockOnly;

  return (
    <section
      id="shop"
      className="relative bg-background"
      style={{
        // Parallax: this section scrolls OVER the fixed hero canvas
        position: 'relative',
        zIndex: 10, // Above the fixed canvas (z-index: 0)
        borderTopLeftRadius: '3rem',
        borderTopRightRadius: '3rem',
        boxShadow: '0 -20px 60px -10px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Decorative top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-3xl"></div>

      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl text-primary-light">
            Shop Our Signature <br />
            <span className="italic text-foreground">Wigs</span>
          </h2>
          {error && (
            <p className="text-yellow-500 text-sm">
              Using offline catalog • {error.message}
            </p>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {/* Category Filter */}
          <CategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* In Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${inStockOnly
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-white/5 border-white/10 text-foreground-muted hover:border-primary/30'
              }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${inStockOnly ? 'border-green-400 bg-green-400' : 'border-foreground-dim'
              }`}>
              {inStockOnly && (
                <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">In Stock Only</span>
          </button>
        </div>

        {/* Active Filters Chips */}
        {hasFilters && (
          <FilterChips
            selectedCategory={selectedCategory}
            inStockOnly={inStockOnly}
            onClearCategory={() => setSelectedCategory(null)}
            onClearInStock={() => setInStockOnly(false)}
            onClearAll={() => {
              setSelectedCategory(null);
              setInStockOnly(false);
            }}
            categoryName={selectedCategoryName}
          />
        )}

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 text-foreground-dim" />
            </div>
            <h3 className="text-xl font-serif text-foreground mb-2">No Products Found</h3>
            <p className="text-foreground-muted text-sm mb-6">
              {hasFilters
                ? "Try adjusting your filters to find what you're looking for."
                : "Check back soon for new arrivals."}
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setInStockOnly(false);
                }}
                className="px-6 py-3 border border-primary/50 text-primary hover:bg-primary hover:text-background-void transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-12 px-0 md:px-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="flex justify-center items-center py-12 mt-4">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-primary/70 bg-background/50 px-4 py-2 rounded-full border border-primary/20">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Loading more styles...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-background-card/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white/5 hover:bg-background-wood/50 transition-colors duration-300">
      <div className="flex space-x-1 mb-4 text-primary">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <h4 className="text-foreground font-serif text-lg mb-2">{review.title}</h4>
      <p className="text-foreground-muted font-sans text-sm md:text-base leading-relaxed mb-4">
        "{review.text}"
      </p>
      <div className="flex items-center justify-between text-xs text-foreground-dim">
        <span>— {review.author}</span>
        <span className="text-primary/70">{review.source}</span>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section className="py-24 pb-32 relative">
      <div className="container mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-primary-light text-center mb-16">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 md:px-12">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-primary-light">
              The Ace Story
            </h2>
            <div className="space-y-4 text-foreground-muted font-sans leading-relaxed">
              <p>
                Ace Wig was born from a simple belief: <strong className="text-foreground">Ghanaian women deserve world-class wigs at prices that don't punish them for wanting to look good.</strong>
              </p>
              <p>
                We started in North Legon with a mission to change the game—no more overpriced imports, no more questionable quality, no more disappointment when the package arrives.
              </p>
              <p>
                Every piece in our collection is hand-selected for quality. We work with <strong className="text-primary">100% virgin hair</strong>, super double drawn for that full, natural flow that lesser wigs can't deliver. And yes—we price it fairly, because accessible luxury isn't a contradiction.
              </p>
            </div>
          </div>

          {/* Right - Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background-card/50 backdrop-blur-md rounded-2xl p-6 border border-white/5">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h4 className="text-foreground font-serif text-lg mb-1">Hours</h4>
              <p className="text-foreground-muted text-sm">Tue – Sat: 9AM – 6PM</p>
            </div>
            <div className="bg-background-card/50 backdrop-blur-md rounded-2xl p-6 border border-white/5">
              <Truck className="w-8 h-8 text-primary mb-3" />
              <h4 className="text-foreground font-serif text-lg mb-1">Delivery</h4>
              <p className="text-foreground-muted text-sm">2-3 Working Days</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: Scissors,
      title: 'Custom Styling',
      description: 'Professional wig customization and styling to match your unique look.',
    },
    {
      icon: Sparkles,
      title: 'Wig Revamp',
      description: 'Breathe new life into your existing wigs with our restoration service.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Nationwide delivery in 2-3 working days. Pickup also available.',
    },
  ];

  return (
    <section
      id="salon"
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/service.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Parallax effect
      }}
    >
      {/* Dark overlay for readability - no blur */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-primary-light mb-4">
            Salon Services
          </h2>
          <p className="text-foreground-muted font-sans max-w-xl mx-auto">
            We don't just sell wigs—we style them, fit them, and stand behind them. Your confidence is our business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 text-center hover:bg-black/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-foreground-muted font-sans text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Footer = () => {
  return (
    <footer className="bg-background-void py-12 border-t border-white/5 relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <img
              src="/logo.png"
              alt="AceWig"
              className="h-10 w-auto mb-4 mx-auto md:mx-0 opacity-80"
              style={{ filter: 'brightness(1.1)' }}
            />
            <p className="text-foreground-dim text-xs">
              © {new Date().getFullYear()} Ace Wig & More Ltd. All rights reserved.
            </p>
          </div>

          {/* Socials */}
          <div className="flex space-x-6">
            <a
              href="https://instagram.com/acewig"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-primary transition-colors hover:scale-110 transform duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/233249494156"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-green-500 transition-colors hover:scale-110 transform duration-300"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-xs text-foreground-dim uppercase tracking-wider">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-background-void">
      {/* Hero */}
      <Hero />

      {/* All content below hero - scrolls OVER the fixed hero canvas */}
      <div className="relative bg-background" style={{ zIndex: 10 }}>
        <ShopSection />
        <ServicesSection />
        <ReviewsSection />
        <AboutSection />
        <Footer />
      </div>
    </div>
  );
};

export default App;