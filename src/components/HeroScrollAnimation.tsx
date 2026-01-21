import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HeroScrollAnimationProps {
    children?: React.ReactNode;
}

const FRAME_COUNT = 240;
const FRAME_PREFIX = 'ezgif-frame-';
const FRAME_EXTENSION = 'jpg';

const HeroScrollAnimation: React.FC<HeroScrollAnimationProps> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number>();

    // Generate frame path with zero-padded index
    const getFramePath = useCallback((index: number) => {
        const paddedIndex = String(index).padStart(3, '0');
        return `/hero animation/${FRAME_PREFIX}${paddedIndex}.${FRAME_EXTENSION}`;
    }, []);

    // Draw a specific frame to the canvas
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const images = imagesRef.current;

        if (!canvas || !ctx || !images[frameIndex]) return;

        const img = images[frameIndex];
        if (!img.complete || img.naturalWidth === 0) return;

        // Set canvas to full viewport size - use FULL device pixel ratio for max quality
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(dpr, dpr);

        // Fill background with pure BLACK for hero section
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Calculate dimensions - position image to the RIGHT side and DROP it down
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;

        // Size: slightly larger than viewport for impact
        const targetHeight = height * (isMobile ? 1.0 : 1.1);
        const targetWidth = targetHeight * imgRatio;

        // X Position: push to the right
        // Mobile: centered + 30% shift to right (was 30% + 20% more = 50%)
        // Tablet: 15% from left
        // Desktop: 15% from left
        let drawX;
        if (isMobile) {
            // Center the image but shift right by 50% of screen width (was 30%)
            drawX = (width - targetWidth) / 2 + (width * 0.50);
        } else if (isTablet) {
            drawX = width * 0.15;
        } else {
            drawX = width * 0.15; // Desktop - push right
        }

        // Y Position: DROP it down from navbar (add offset from top)
        // Shift down by ~8% on desktop, less on mobile
        const dropOffset = isMobile ? height * 0.05 : height * 0.08;
        const drawY = ((height - targetHeight) / 2) + dropOffset;

        // Enable maximum image quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, drawX, drawY, targetWidth, targetHeight);
    }, []);

    // Preload all images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const preloadImage = (index: number): Promise<HTMLImageElement> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = getFramePath(index);
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                    resolve(img);
                };
                img.onerror = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                    resolve(img);
                };
            });
        };

        const loadAllImages = async () => {
            // Load images in batches for faster loading
            const batchSize = 25;
            for (let i = 1; i <= FRAME_COUNT; i += batchSize) {
                const batch = [];
                for (let j = i; j < Math.min(i + batchSize, FRAME_COUNT + 1); j++) {
                    batch.push(preloadImage(j));
                }
                const loadedBatch = await Promise.all(batch);
                loadedBatch.forEach((img, idx) => {
                    images[i + idx - 1] = img;
                });
            }

            imagesRef.current = images;
            setIsLoading(false);
            // Draw first frame
            drawFrame(0);
        };

        loadAllImages();

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [getFramePath, drawFrame]);

    // Handle scroll to update frame
    useEffect(() => {
        // if (isLoading) return; // Allow drawing even if still loading batches? No, better wait for refined logic or check for image existence.
        // Actually, for simplicity, I'll keep default behavior but just not BLOCK the UI.

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress through this section
            // 0 = top of container at top of viewport
            // 1 = bottom of container at bottom of viewport
            const scrollableDistance = containerHeight - viewportHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

            // Map progress to frame index
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(progress * (FRAME_COUNT - 1)))
            );

            // Only redraw if frame changed
            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                rafRef.current = requestAnimationFrame(() => {
                    drawFrame(frameIndex);
                });
            }
        };

        // Initial draw
        handleScroll();

        // Throttled scroll handler
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('resize', () => {
            drawFrame(currentFrameRef.current);
        });

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [drawFrame]); // Removed isLoading dependency to allow immediate interaction

    return (
        <>
            {/* FIXED Canvas - Stays in place, content scrolls over it */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-screen h-screen"
                style={{
                    opacity: 1, // Always visible
                    zIndex: 0, // Behind everything
                }}
            />

            {/* Scroll container - determines animation progress (invisible spacer) */}
            {/* This MUST be pointer-events-none so it doesn't block clicks on content */}
            <div
                ref={containerRef}
                className="relative pointer-events-none"
                style={{ height: '300vh', zIndex: 1 }}
            >
                {/* This is just a spacer to allow scrolling */}
            </div>

            {/* FIXED Content overlay - Text also stays in place */}
            {/* This is ABOVE the spacer so buttons are clickable */}
            <div
                className="fixed top-0 left-0 w-screen h-screen"
                style={{
                    opacity: 1,
                    zIndex: 5, // Above spacer, buttons clickable
                    pointerEvents: 'none', // Container doesn't block scroll
                }}
            >
                <div className="pointer-events-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
};

export default HeroScrollAnimation;
