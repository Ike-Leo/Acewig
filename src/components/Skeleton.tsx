/**
 * Skeleton Loading Components
 * 
 * Shimmer animation placeholders matching dark luxury theme.
 */

import React from 'react';

// =====================================
// Base Skeleton Component
// =====================================

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
}) => {
    const variantClasses = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded-md',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${variantClasses[variant]} ${className}`}
            style={{
                ...style,
                animation: 'shimmer 2s ease-in-out infinite',
            }}
        />
    );
};

// =====================================
// Product Card Skeleton
// =====================================

export const ProductCardSkeleton: React.FC = () => (
    <div className="group relative flex flex-col items-center">
        <div className="w-full aspect-[4/5] bg-background-card/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
            {/* Image placeholder */}
            <Skeleton className="w-full h-full rounded-none" />

            {/* Price placeholder at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-2" variant="text" />
                <Skeleton className="h-6 w-32 mx-auto" variant="text" />
            </div>
        </div>
    </div>
);

// =====================================
// Cart Item Skeleton
// =====================================

export const CartItemSkeleton: React.FC = () => (
    <div className="flex gap-4 py-4 border-b border-white/5">
        {/* Image */}
        <Skeleton className="w-20 h-20 rounded-xl" />

        {/* Details */}
        <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" variant="text" />
            <Skeleton className="h-4 w-16 mb-3" variant="text" />
            <Skeleton className="h-8 w-28" />
        </div>

        {/* Price */}
        <Skeleton className="h-5 w-20" variant="text" />
    </div>
);

// =====================================
// Checkout Summary Skeleton
// =====================================

export const CheckoutSummarySkeleton: React.FC = () => (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <Skeleton className="h-5 w-32 mb-4" variant="text" />

        <div className="space-y-3 mb-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="h-3 w-full mb-1" variant="text" />
                        <Skeleton className="h-3 w-12" variant="text" />
                    </div>
                    <Skeleton className="h-4 w-16" variant="text" />
                </div>
            ))}
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between">
                <Skeleton className="h-4 w-16" variant="text" />
                <Skeleton className="h-4 w-20" variant="text" />
            </div>
            <div className="flex justify-between">
                <Skeleton className="h-4 w-16" variant="text" />
                <Skeleton className="h-4 w-12" variant="text" />
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
                <Skeleton className="h-5 w-12" variant="text" />
                <Skeleton className="h-6 w-24" variant="text" />
            </div>
        </div>
    </div>
);

// =====================================
// Search Result Skeleton
// =====================================

export const SearchResultSkeleton: React.FC = () => (
    <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-1" variant="text" />
            <Skeleton className="h-3 w-16" variant="text" />
        </div>
    </div>
);

// =====================================
// Product Grid Skeleton
// =====================================

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-12 px-0 md:px-12">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// =====================================
// Add shimmer keyframes to CSS
// =====================================

/*
Add this to your index.css:

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
*/

export default Skeleton;
