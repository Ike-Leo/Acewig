import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationProps {
    frameCount: number;
    framePrefix: string;
    frameExtension?: string;
    className?: string;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    frameCount,
    framePrefix,
    frameExtension = 'jpg',
    className = '',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const currentFrameRef = useRef(0);
    const animationFrameRef = useRef<number>();

    // Generate frame path with zero-padded index
    const getFramePath = useCallback((index: number) => {
        const paddedIndex = String(index).padStart(3, '0');
        return `/hero animation/${framePrefix}${paddedIndex}.${frameExtension}`;
    }, [framePrefix, frameExtension]);

    // Preload all images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const preloadImage = (index: number): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = getFramePath(index);
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / frameCount) * 100));
                    resolve(img);
                };
                img.onerror = () => {
                    console.warn(`Failed to load frame ${index}`);
                    // Resolve anyway to continue loading
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / frameCount) * 100));
                    resolve(img);
                };
            });
        };

        const loadAllImages = async () => {
            // Load images in parallel batches for faster loading
            const batchSize = 20;
            for (let i = 1; i <= frameCount; i += batchSize) {
                const batch = [];
                for (let j = i; j < Math.min(i + batchSize, frameCount + 1); j++) {
                    batch.push(preloadImage(j));
                }
                const loadedBatch = await Promise.all(batch);
                loadedBatch.forEach((img, idx) => {
                    images[i + idx - 1] = img;
                });
            }

            imagesRef.current = images;
            setIsLoading(false);

            // Draw the first frame once loaded
            drawFrame(0);
        };

        loadAllImages();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [frameCount, getFramePath]);

    // Draw a specific frame to the canvas
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const images = imagesRef.current;

        if (!canvas || !ctx || !images[frameIndex]) return;

        const img = images[frameIndex];

        // Set canvas dimensions to match container while maintaining aspect ratio
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            // Set display size
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Set actual canvas size accounting for device pixel ratio
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Scale context for retina displays
            ctx.scale(dpr, dpr);
        }

        // Clear and draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions to cover the container (like CSS background-size: cover)
        const containerWidth = canvas.width / (window.devicePixelRatio || 1);
        const containerHeight = canvas.height / (window.devicePixelRatio || 1);
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = containerWidth / containerHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > containerRatio) {
            // Image is wider than container
            drawHeight = containerHeight;
            drawWidth = drawHeight * imgRatio;
            drawX = (containerWidth - drawWidth) / 2;
            drawY = 0;
        } else {
            // Image is taller than container
            drawWidth = containerWidth;
            drawHeight = drawWidth / imgRatio;
            drawX = 0;
            drawY = (containerHeight - drawHeight) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, []);

    // Handle scroll to update frame
    useEffect(() => {
        if (isLoading) return;

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            // Get the scroll progress relative to the hero section
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress:
            // - Start when element enters viewport (top of element at bottom of viewport)
            // - End when element leaves viewport (bottom of element at top of viewport)
            const scrollStart = rect.top + viewportHeight;
            const scrollEnd = rect.bottom;
            const scrollRange = scrollStart - scrollEnd + viewportHeight;
            const scrollProgress = Math.max(0, Math.min(1, (scrollStart - viewportHeight) / scrollRange));

            // Map scroll progress to frame index
            const frameIndex = Math.min(
                imagesRef.current.length - 1,
                Math.max(0, Math.floor(scrollProgress * (imagesRef.current.length - 1)))
            );

            // Only redraw if frame changed
            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                animationFrameRef.current = requestAnimationFrame(() => {
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
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('resize', () => drawFrame(currentFrameRef.current));

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('resize', () => drawFrame(currentFrameRef.current));
        };
    }, [isLoading, drawFrame]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-void/50 backdrop-blur-sm z-10">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <span className="text-primary font-sans text-sm uppercase tracking-widest">{loadProgress}%</span>
                </div>
            )}

            {/* Canvas for animation */}
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
                style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-out' }}
            />
        </div>
    );
};

export default ScrollAnimation;
