/**
 * Search Bar Component with Instant Results
 * 
 * Debounced search with dropdown showing product results.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useProductSearch } from '@/src/services/hooks';
import { useModal } from '@/src/contexts/AppContext';
import { Product } from '@/types';

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    onResultClick?: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    className = '',
    placeholder = 'Search wigs...',
    onResultClick,
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { results, loading } = useProductSearch(query, 6);
    const { openQuickView } = useModal();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Open dropdown when typing
    useEffect(() => {
        if (query.trim().length > 0) {
            setIsOpen(true);
        }
    }, [query]);

    const handleResultClick = (product: Product) => {
        setIsOpen(false);
        setQuery('');

        if (onResultClick) {
            onResultClick(product);
        } else {
            // Default: open quick view
            openQuickView(product);
        }
    };

    const handleClear = () => {
        setQuery('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        if (query.trim().length > 0) {
            setIsOpen(true);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className="w-full py-2 pl-10 pr-10 bg-white/5 border border-white/10 rounded-full text-sm text-foreground placeholder:text-foreground-dim focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-dim hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="p-6 text-center">
                            <Loader2 className="w-6 h-6 mx-auto text-primary animate-spin" />
                            <p className="text-sm text-foreground-muted mt-2">Searching...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-6 text-center">
                            <Search className="w-8 h-8 mx-auto text-foreground-dim mb-2" />
                            <p className="text-sm text-foreground-muted">
                                No results for "{query}"
                            </p>
                            <p className="text-xs text-foreground-dim mt-1">
                                Try a different search term
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => handleResultClick(product)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                >
                                    {/* Product Image */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                        <img
                                            src={product.image || '/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-primary font-serif">
                                            GH₵{product.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Stock Badge */}
                                    {product.inStock === false && (
                                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                            Out of Stock
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
