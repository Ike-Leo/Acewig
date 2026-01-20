/**
 * Variant Selector Component
 * 
 * Displays product variant options as selectable buttons.
 * Shows variant-specific price and stock status.
 */

import React from 'react';
import { Check } from 'lucide-react';
import { ProductVariant } from '@/types';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onSelect: (variant: ProductVariant) => void;
    className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
    variants,
    selectedVariant,
    onSelect,
    className = '',
}) => {
    // Group variants by option type (e.g., "Size", "Color")
    const optionTypes = React.useMemo(() => {
        const types = new Set<string>();
        variants.forEach(variant => {
            Object.keys(variant.options).forEach(key => types.add(key));
        });
        return Array.from(types);
    }, [variants]);

    // If there's only one variant or no options, don't show selector
    if (variants.length <= 1 || optionTypes.length === 0) {
        return null;
    }

    // Get unique values for each option type
    const getUniqueValues = (optionType: string): string[] => {
        const values = new Set<string>();
        variants.forEach(variant => {
            if (variant.options[optionType]) {
                values.add(variant.options[optionType]);
            }
        });
        return Array.from(values);
    };

    // Find variant matching current selection with a specific option changed
    const findMatchingVariant = (optionType: string, value: string): ProductVariant | null => {
        const currentOptions = selectedVariant?.options || {};
        return variants.find(v => {
            // Must match the selected value for this option type
            if (v.options[optionType] !== value) return false;
            // Must match all other selected options
            for (const key of optionTypes) {
                if (key !== optionType && currentOptions[key] && v.options[key] !== currentOptions[key]) {
                    return false;
                }
            }
            return true;
        }) || null;
    };

    // Check if a specific option value is available
    const isValueAvailable = (optionType: string, value: string): boolean => {
        const variant = findMatchingVariant(optionType, value);
        return variant !== null && variant.stockQuantity > 0;
    };

    const handleSelect = (optionType: string, value: string) => {
        const variant = findMatchingVariant(optionType, value);
        if (variant && variant.stockQuantity > 0) {
            onSelect(variant);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {optionTypes.map(optionType => {
                const values = getUniqueValues(optionType);
                const currentValue = selectedVariant?.options[optionType];

                return (
                    <div key={optionType}>
                        <label className="block text-sm font-medium text-foreground-muted mb-2 uppercase tracking-wide">
                            {optionType}
                            {currentValue && (
                                <span className="ml-2 text-foreground font-normal normal-case">
                                    — {currentValue}
                                </span>
                            )}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {values.map(value => {
                                const isSelected = currentValue === value;
                                const isAvailable = isValueAvailable(optionType, value);
                                const matchingVariant = findMatchingVariant(optionType, value);

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleSelect(optionType, value)}
                                        disabled={!isAvailable}
                                        className={`
                      relative px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                      ${isSelected
                                                ? 'bg-primary/20 border-primary text-primary ring-1 ring-primary/30'
                                                : isAvailable
                                                    ? 'bg-white/5 border-white/10 text-foreground hover:border-primary/50 hover:bg-white/10'
                                                    : 'bg-white/5 border-white/5 text-foreground-dim opacity-50 cursor-not-allowed line-through'
                                            }
                    `}
                                        aria-pressed={isSelected}
                                        aria-disabled={!isAvailable}
                                    >
                                        {/* Selected Checkmark */}
                                        {isSelected && (
                                            <Check className="absolute -top-1 -right-1 w-4 h-4 text-primary bg-background rounded-full p-0.5" />
                                        )}

                                        {value}

                                        {/* Out of Stock Indicator */}
                                        {!isAvailable && (
                                            <span className="absolute inset-0 flex items-center justify-center">
                                                <span className="w-full h-0.5 bg-red-500/50 rotate-[-12deg]" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Selected Variant Details */}
            {selectedVariant && (
                <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground-muted">
                            SKU: <span className="text-foreground">{selectedVariant.sku}</span>
                        </span>
                        <span className={`font-medium ${selectedVariant.stockQuantity > 5 ? 'text-green-400' : selectedVariant.stockQuantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {selectedVariant.stockQuantity > 10
                                ? 'In Stock'
                                : selectedVariant.stockQuantity > 0
                                    ? `Only ${selectedVariant.stockQuantity} left`
                                    : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantSelector;
