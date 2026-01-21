import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CartProvider } from '@/src/contexts/CartContext';
import { AppProvider } from '@/src/contexts/AppContext';
import { WishlistProvider } from '@/src/contexts/WishlistContext';
import { CartDrawer } from './CartDrawer';
import { ProductQuickView } from './ProductQuickView';
import { CheckoutModal } from './CheckoutModal';
import { OrderConfirmation } from './OrderConfirmation';
import { OrderTracking } from './OrderTracking';
import { ToastContainer } from './Toast';

export const Layout = () => {
    const location = useLocation();

    // Handle scroll on route change and hash navigation
    React.useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash]);

    return (
        <CartProvider>
            <AppProvider>
                <WishlistProvider>
                    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-background-void font-sans">
                        <Navbar />
                        <main>
                            <Outlet />
                        </main>

                        {/* Global Modals */}
                        <CartDrawer />
                        <ProductQuickView />
                        <CheckoutModal />
                        <OrderConfirmation />
                        <OrderTracking />
                        {/* Toast Notifications */}
                        <ToastContainer />
                    </div>
                </WishlistProvider>
            </AppProvider>
        </CartProvider>
    );
};
