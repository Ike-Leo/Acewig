import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
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
import { ProductCard } from '@/src/components/ProductCard';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { TrendingUp } from 'lucide-react';

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
    text: "Girl, you're the CHIC! It's so beautiful—you've won me for life. 💗",
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

            <Link
              to="/contact"
              className="inline-block px-6 md:px-8 py-3 md:py-4 bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-background-void transition-all duration-300 uppercase tracking-widest text-xs md:text-sm font-bold"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Shop Now Badge */}
        <div className="absolute bottom-24 right-6 md:bottom-56 md:right-12">
          <a
            href="#shop"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/10 bg-background-void/60 backdrop-blur-md flex flex-col items-center justify-center text-center group hover:scale-110 transition-transform duration-300 shadow-2xl"
          >
            <span className="font-serif text-primary uppercase text-xs md:text-sm tracking-widest leading-none mb-1 group-hover:text-foreground transition-colors">Shop</span>
            <span className="font-serif text-foreground uppercase text-[10px] md:text-xs tracking-widest leading-none">Now</span>
          </a>
        </div>

        {/* Trending Badge (Mobile: Left, Desktop: Right under Shop Now) */}
        <div className="absolute bottom-24 left-6 md:bottom-24 md:right-12 md:left-auto">
          <Link
            to="/trending"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/10 bg-background-void/60 backdrop-blur-md flex flex-col items-center justify-center text-center group hover:scale-110 transition-transform duration-300 shadow-2xl"
          >
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary mb-1 group-hover:text-foreground transition-colors" />
            <span className="font-serif text-foreground uppercase text-[8px] md:text-[10px] tracking-widest leading-none">Trending</span>
          </Link>
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

  // Wishlist Context
  const { toggleWishlist, isInWishlist } = useWishlist();

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
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist(product.id)}
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-background-card/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white/5 hover:bg-background-wood/50 transition-colors duration-300"
    >
      <div className="flex space-x-1 mb-4 text-primary">
        {[...Array(review.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
        ))}
      </div>
      <motion.h4
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-foreground font-serif text-lg mb-2"
      >
        {review.title}
      </motion.h4>

      {/* Typewriter Effect for Text */}
      <div className="min-h-[80px] mb-4">
        <p className="text-foreground-muted font-sans text-sm md:text-base leading-relaxed inline-block">
          <span className="sr-only">{review.text}</span>
          <motion.span
            initial={{ opacity: 1 }}
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.015 } }
            }}
            aria-hidden
          >
            {review.text.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                initial="hidden"
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center justify-between text-xs text-foreground-dim"
      >
        <span>— {review.author}</span>
        <span className="text-primary/70">{review.source}</span>
      </motion.div>
    </motion.div>
  );
};

const ReviewsSection = () => {
  return (
    <section className="py-24 pb-32 relative">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl md:text-5xl text-primary-light text-center mb-16"
        >
          Customer Reviews
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 md:px-12">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};





const Footer = () => {
  return (
    <footer className="bg-background-void py-16 border-t border-white/10 relative z-20">
      <div className="container mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div>
            <img
              src="/logo.png"
              alt="AceWig"
              className="h-12 w-auto mb-4 opacity-90"
              style={{ filter: 'brightness(1.1)' }}
            />
            <p className="text-foreground-muted text-sm leading-relaxed mb-4">
              Affordable luxury at your fingertips. Premium wigs, professional styling, and personalized service in North Legon.
            </p>
            {/* Socials */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/acewig"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/233249494156"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground-muted hover:text-green-500 hover:bg-green-500/10 transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#shop" className="text-foreground-muted hover:text-primary transition-colors text-sm">Shop Wigs</a>
              </li>
              <li>
                <a href="/services" className="text-foreground-muted hover:text-primary transition-colors text-sm">Salon Services</a>
              </li>
              <li>
                <a href="/about" className="text-foreground-muted hover:text-primary transition-colors text-sm">About Ace</a>
              </li>
              <li>
                <a href="/contact" className="text-foreground-muted hover:text-primary transition-colors text-sm">Contact Us</a>
              </li>
              <li>
                <a href="/trending" className="text-foreground-muted hover:text-primary transition-colors text-sm">Trending Now</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground-muted">North Legon, Accra, Ghana</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground-muted">Tue – Sat: 9:00 AM – 6:00 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+233249494156" className="text-foreground-muted hover:text-primary transition-colors">
                  +233 249 494 156
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Delivery */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Payment & Delivery</h4>
            <ul className="space-y-4 text-sm text-foreground-muted">
              <li className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>MTN MoMo Accepted<br /><span className="text-foreground-dim text-xs">Merchant: ACE WIG & MORE LD</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Delivery in 2–3 working days<br /><span className="text-foreground-dim text-xs">Pickup available at salon</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground-dim text-xs">
            © {new Date().getFullYear()} Ace Wig & More Ltd. All rights reserved.
          </p>
          <p className="text-foreground-dim text-xs italic">
            Affordable Luxury at Your Fingertips™
          </p>
          <div className="flex space-x-6 text-xs text-foreground-dim">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
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
        <ReviewsSection />
        <Footer />
      </div>
    </div>
  );
};

export default App;