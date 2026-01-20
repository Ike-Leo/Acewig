import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { NavItem } from '@/types';
import { useCartContext } from '@/src/contexts/CartContext';
import { useModal } from '@/src/contexts/AppContext';
import { SearchBar } from '@/src/components/SearchBar';

const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop Wigs', href: '/#shop' },
    { label: 'Salon Services', href: '/services' },
    { label: 'About Ace', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get cart context and modal controls
    let cartItemCount = 0;
    let openCartDrawer: (() => void) | undefined;

    try {
        const cartContext = useCartContext();
        cartItemCount = cartContext.totalItems;
    } catch {
        // Cart context not available, use 0
    }

    try {
        const modalContext = useModal();
        openCartDrawer = modalContext.openCart;
    } catch {
        // Modal context not available
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="AceWig"
                            className="h-12 md:h-16 w-auto"
                            style={{ filter: 'brightness(1.1)' }}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_ITEMS.map((item) => (
                            item.href.startsWith('/') && item.href !== '#shop' && item.href !== '#contact' ? (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className="text-sm font-sans text-foreground-muted hover:text-primary transition-colors uppercase tracking-wide"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm font-sans text-foreground-muted hover:text-primary transition-colors uppercase tracking-wide"
                                >
                                    {item.label}
                                </a>
                            )
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search Bar - Desktop */}
                        <div className="hidden sm:block">
                            <SearchBar className="w-48 lg:w-56" placeholder="Search wigs..." />
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={openCartDrawer}
                            className="flex items-center space-x-2 border border-foreground-muted/30 rounded-full px-4 py-1.5 hover:border-primary hover:text-primary transition-all group text-foreground-muted relative"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Cart</span>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-background-void text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

            </nav>

            {/* Mobile Menu - Slides in from RIGHT - Moved outside nav to avoid clipping from backdrop-filter */}
            <div
                className={`md:hidden fixed inset-0 z-[1000] transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Sidebar - using inline style for guaranteed solid background */}
                <div
                    className={`absolute top-0 right-0 h-full w-72 border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{ backgroundColor: '#0a0a0a' }}
                >
                    {/* Close Button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-foreground-muted hover:text-primary transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="px-6 py-4 flex flex-col space-y-6">
                        {NAV_ITEMS.map((item) => (
                            item.href.startsWith('/') && item.href !== '#shop' && item.href !== '#contact' ? (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className="text-lg font-sans text-foreground hover:text-primary transition-colors uppercase tracking-wider"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-lg font-sans text-foreground hover:text-primary transition-colors uppercase tracking-wider"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            )
                        ))}
                    </div>

                    {/* Search */}
                    <div className="px-6 py-4 border-t border-white/10 mt-4">
                        <SearchBar className="w-full" placeholder="Search..." />
                    </div>
                </div>
            </div>
        </>
    );
};
