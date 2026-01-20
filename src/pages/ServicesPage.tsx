import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Scissors, Sparkles, Truck, Palette, Heart, Star, ArrowLeft, MessageCircle, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Service Data with enhanced copy
const services = [
    {
        icon: Scissors,
        title: 'Bespoke Customization',
        description: 'Precision cutting and shaping tailored to your unique facial structure. We craft the perfect silhouette to enhance your natural beauty. Our experts analyze your features to create a look that is uniquely yours.',
        price: 'From GH₵150',
        features: ['Custom cuts & shaping', 'Face-framing layers', 'Bangs/Fringe styling', 'Heat styling finish'],
        image: '/service.jpeg'
    },
    {
        icon: Sparkles,
        title: 'Revamp & Restoration',
        description: 'Breathe new life into your collection. Our deep conditioning and detangling rituals restore natural luster and softness. We treat every strand with premium products to ensure longevity and shine.',
        price: 'From GH₵200',
        features: ['Deep conditioning spa', 'Expert detangling', 'Color brilliance refresh', 'Lace repair & renewal'],
        image: '/service.jpeg'
    },
    {
        icon: Palette,
        title: 'Chromatic Transformation',
        description: 'Expert color alchemy. From subtle sun-kissed highlights to bold, statement-making transformations that turn heads. We use gentle, high-quality dyes to protect integrity while achieving vibrant results.',
        price: 'From GH₵300',
        features: ['Full custom color', 'Dimensional highlights', 'Balayage techniques', 'Color correction'],
        image: '/service.jpeg'
    },
    {
        icon: Heart,
        title: 'Seamless Installation',
        description: 'The art of the undetectable. Flawless application for a secure, natural finish that boosts your confidence all day. Whether you prefer glueless or adhesive methods, we ensure comfort and style.',
        price: 'From GH₵100',
        features: ['Lace frontal install', 'Closure perfection', 'Glueless methods', 'Maintenance education'],
        image: '/service.jpeg'
    },
    {
        icon: Star,
        title: 'Style Consultation',
        description: 'A private session to discover your signature look. We analyze your style, preferences, and lifestyle to find your perfect match. Get expert advice on what textures and lengths suit you best.',
        price: 'Complimentary',
        features: ['Face shape analysis', 'Lifestyle matching', 'Color theory', 'Care guidance'],
        image: '/service.jpeg'
    },
    {
        icon: Truck,
        title: 'White Glove Delivery',
        description: 'Premium logistics. Secure, tracked delivery across Ghana or VIP pickup from our North Legon salon. We ensure your items arrive in pristine condition, ready to wear.',
        price: 'From GH₵30',
        features: ['Same-day local service', 'Nationwide shipping', 'VIP Salon pickup', 'Real-time tracking'],
        image: '/service.jpeg'
    },
];

const ServiceSection = ({ service, index }: { service: typeof services[0]; index: number }) => {
    // Reverse layout for every second item
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "flex flex-col md:flex-row items-stretch min-h-[70vh] w-full overflow-hidden mb-24 last:mb-0",
                isEven ? "" : "md:flex-row-reverse"
            )}
        >
            {/* Text Content Side */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10 bg-background-void/5">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-[1px] bg-primary"></div>
                    <span className="text-primary text-sm tracking-[0.2em] uppercase font-bold">Service {String(index + 1).padStart(2, '0')}</span>
                </div>

                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
                    {service.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? 'text-primary' : ''}> {word}</span>
                    ))}
                </h3>

                <p className="text-foreground-muted text-lg leading-relaxed mb-10 max-w-xl">
                    {service.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                    {service.features.map((feature, i) => (
                        <span key={i} className="px-4 py-2 border border-primary/20 rounded-full text-xs text-primary-dim uppercase tracking-wider hover:bg-primary/10 transition-colors cursor-default">
                            {feature}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-6 mt-auto">
                    <div className="text-2xl font-serif text-white">{service.price}</div>
                    <button className="px-6 py-3 bg-transparent border border-white/20 hover:border-primary text-white hover:text-primary rounded-full transition-all text-sm uppercase tracking-widest">
                        Book Now
                    </button>
                </div>
            </div>

            {/* Visual Side */}
            <div className="flex-1 relative min-h-[400px] md:min-h-full group overflow-hidden">
                {/* Image Container with Parallax Effect */}
                <div className="absolute inset-0 transition-transform duration-700 hover:scale-105">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Floating Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 rounded-full border border-white/10 backdrop-blur-sm flex items-center justify-center bg-black/20 group-hover:scale-110 transition-transform duration-500">
                        <service.icon className="w-12 h-12 text-white/80" />
                    </div>
                </div>

                {/* Decorative "Gold Box" vibes */}
                <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-primary/30 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-primary/30 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
};

const ServicesPage = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Random floating particles configuration (REMOVED per previous user request, kept clean)

    return (
        <div className="min-h-screen bg-background-void text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dim to-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Navigation (Back) - Removed as Navbar is now persistent */}

            {/* Hero Section (Restored "Art of Perfection" Design) */}
            <section className="relative h-[90vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0 select-none"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: 'url(/service.jpeg)' }}
                    />
                    {/* Gradient Overlay for Readability & Mood */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background-void" />
                    <div className="absolute inset-0 bg-background-void/30 backdrop-blur-[1px]" />
                </motion.div>

                {/* Hero Content */}
                <div className="relative z-10 px-6 max-w-7xl mx-auto w-full text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-block"
                        >
                            <h2 className="text-primary-dim font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 pl-1">
                                Bespoke Care
                            </h2>
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1]">
                                The Art of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-primary italic pr-2">
                                    Perfection
                                </span>
                            </h1>
                            <p className="text-foreground-muted text-lg md:text-xl max-w-lg font-light leading-relaxed mb-10 md:mr-auto">
                                Experience a realm where luxury meets transformation. Our curated services are designed to elevate your style to its highest potential.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-background-void rounded-full transition-all duration-300 backdrop-blur-sm tracking-widest uppercase text-xs font-bold"
                            >
                                Explore Services
                            </motion.button>
                        </motion.div>
                    </div>


                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/30 flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </section>

            {/* Services Grid Section (Using the NEW Split Card Design) */}
            <div id="services-grid" className="max-w-[none] py-24">
                {services.map((service, index) => (
                    <ServiceSection key={index} service={service} index={index} />
                ))}
            </div>

            {/* Call to Action - Parallax Strip (Restored Previous Design) */}
            <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-primary/5 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background-void to-background-void"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-white mb-8">
                            Ready for your <span className="text-primary italic">Transformation?</span>
                        </h2>

                        <p className="text-foreground-muted max-w-xl mx-auto mb-12 text-lg md:text-xl font-light">
                            Our artisans are waiting to craft your perfect look. Connect with us to begin your journey.
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            <a
                                href="https://wa.me/233249494156"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-primary to-primary-light text-background-void rounded-full transition-all duration-300 font-bold text-lg shadow-[0_0_20px_rgba(230,192,117,0.3)] hover:shadow-[0_0_50px_rgba(230,192,117,0.6)] group"
                            >
                                <MessageCircle className="w-6 h-6 fill-background-void" />
                                <span>Book Appointment</span>
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
