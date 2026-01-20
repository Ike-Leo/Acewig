/**
 * Quantity Picker Component
 * 
 * +/- buttons with input field. Respects max stock limits.
 */

import React from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';

interface QuantityPickerProps {
    quantity: number;
    maxStock?: number;
    onChange: (quantity: number) => void;
    disabled?: boolean;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    allowDecrease?: boolean;
}

export const QuantityPicker: React.FC<QuantityPickerProps> = ({
    quantity,
    maxStock = 99,
    onChange,
    disabled = false,
    loading = false,
    size = 'md',
    className = '',
    allowDecrease = true,
}) => {
    const canDecrease = quantity > 1 && !disabled && !loading && allowDecrease;
    const canIncrease = quantity < maxStock && !disabled && !loading;

    const handleDecrease = () => {
        if (canDecrease) {
            onChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (canIncrease) {
            onChange(quantity + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= maxStock) {
            onChange(value);
        }
    };

    // Size variants
    const sizeClasses = {
        sm: {
            button: 'w-7 h-7 text-sm',
            input: 'w-10 h-7 text-sm',
            icon: 'w-3 h-3',
        },
        md: {
            button: 'w-9 h-9 text-base',
            input: 'w-12 h-9 text-base',
            icon: 'w-4 h-4',
        },
        lg: {
            button: 'w-11 h-11 text-lg',
            input: 'w-14 h-11 text-lg',
            icon: 'w-5 h-5',
        },
    };

    const classes = sizeClasses[size];

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {/* Decrease Button */}
            <button
                type="button"
                onClick={handleDecrease}
                disabled={!canDecrease}
                className={`${classes.button} flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-all hover:bg-white/10 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed`}
                aria-label="Decrease quantity"
            >
                <Minus className={classes.icon} />
            </button>

            {/* Quantity Display/Input */}
            <div className="relative">
                {loading ? (
                    <div className={`${classes.input} flex items-center justify-center rounded-lg border border-white/10 bg-white/5`}>
                        <Loader2 className={`${classes.icon} animate-spin text-primary`} />
                    </div>
                ) : (
                    <input
                        type="number"
                        min={1}
                        max={maxStock}
                        value={quantity}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className={`${classes.input} text-center rounded-lg border border-white/10 bg-white/5 text-foreground font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        aria-label="Quantity"
                    />
                )}
            </div>

            {/* Increase Button */}
            <button
                type="button"
                onClick={handleIncrease}
                disabled={!canIncrease}
                className={`${classes.button} flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-all hover:bg-white/10 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed`}
                aria-label="Increase quantity"
            >
                <Plus className={classes.icon} />
            </button>

            {/* Stock Warning */}
            {quantity >= maxStock && maxStock < 10 && (
                <span className="text-xs text-yellow-500 ml-2">
                    Only {maxStock} left
                </span>
            )}
        </div>
    );
};

export default QuantityPicker;
