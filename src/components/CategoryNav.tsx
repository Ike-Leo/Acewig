/**
 * Category Navigation Component
 * 
 * Dropdown/sidebar showing product categories from API.
 * Filter products by category with product count.
 */

import React, { useState } from 'react';
import { ChevronDown, Tag, Loader2, X } from 'lucide-react';
import { useCategories } from '@/src/services/hooks';

interface CategoryNavProps {
    selectedCategory: string | null;
    onSelectCategory: (categorySlug: string | null) => void;
    className?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
    selectedCategory,
    onSelectCategory,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { categories, loading, error } = useCategories();

    const selectedCategoryName = selectedCategory
        ? categories.find(c => c.slug === selectedCategory)?.name || 'Category'
        : 'All Categories';

    const handleSelect = (categorySlug: string | null) => {
        onSelectCategory(categorySlug);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${selectedCategory
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-white/5 border-white/10 text-foreground hover:border-primary/30'
                    }`}
            >
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedCategoryName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-400 text-sm">
                                Failed to load categories
                            </div>
                        ) : (
                            <div className="py-2">
                                {/* All Categories Option */}
                                <button
                                    onClick={() => handleSelect(null)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedCategory === null
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-sm font-medium">All Categories</span>
                                    {selectedCategory === null && (
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="border-t border-white/5 my-1" />

                                {/* Category List */}
                                {categories.map(category => (
                                    <button
                                        key={category._id}
                                        onClick={() => handleSelect(category.slug)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedCategory === category.slug
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            {category.productCount !== undefined && (
                                                <span className="text-xs text-foreground-dim bg-white/5 px-2 py-0.5 rounded-full">
                                                    {category.productCount}
                                                </span>
                                            )}
                                            {selectedCategory === category.slug && (
                                                <span className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}

                                {categories.length === 0 && (
                                    <div className="px-4 py-6 text-center text-foreground-dim text-sm">
                                        No categories found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// =====================================
// Filter Chips Component
// =====================================

interface FilterChipsProps {
    selectedCategory: string | null;
    inStockOnly: boolean;
    onClearCategory: () => void;
    onClearInStock: () => void;
    onClearAll: () => void;
    categoryName?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
    selectedCategory,
    inStockOnly,
    onClearCategory,
    onClearInStock,
    onClearAll,
    categoryName,
}) => {
    const hasFilters = selectedCategory || inStockOnly;

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-foreground-dim uppercase tracking-wide">Active Filters:</span>

            {selectedCategory && (
                <button
                    onClick={onClearCategory}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                    <Tag className="w-3 h-3" />
                    <span>{categoryName || selectedCategory}</span>
                    <X className="w-3 h-3" />
                </button>
            )}

            {inStockOnly && (
                <button
                    onClick={onClearInStock}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium rounded-full hover:bg-green-500/20 transition-colors"
                >
                    <span>In Stock Only</span>
                    <X className="w-3 h-3" />
                </button>
            )}

            <button
                onClick={onClearAll}
                className="text-xs text-foreground-dim hover:text-foreground transition-colors underline underline-offset-2"
            >
                Clear All
            </button>
        </div>
    );
};

export default CategoryNav;
