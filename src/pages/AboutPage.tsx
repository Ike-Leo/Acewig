import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, MessageCircle, ChevronDown, CheckCircle, Award, Users, Gem } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// About Page Data
const contentSections = [
    {
        icon: Gem,
        label: 'Our Origin',
        title: 'Born from a need for Excellence',
        description: 'Ace Wig & More started in North Legon with a simple yet revolutionary belief: Ghanaian women deserve world-class luxury without the heavy markup. We saw a gap between "affordable" and "quality" and decided to bridge it. No more compromising. No more "what I ordered vs what I got". Just pure, unadulterated quality.',
        image: '/service.jpeg', // Using existing asset as placeholder
        stats: [
            { label: 'Est.', value: '2019' },
            { label: 'Clients', value: '30k+' }
        ]
    },
    {
        icon: Award,
        label: 'Our Standard',
        title: 'The "Super Double Drawn" Promise',
        description: 'Quality is not just a buzzword; it is our baseline. Every strand we sell is 100% virgin hair, rigorously tested. We specialize in Super Double Drawn (SDD) and Raw Vietnamese hair—meaning fullness from root to tip. We reject the "thin ends" industry standard to give you hair that moves, bounces, and commands attention.',
        image: '/service.jpeg',
        stats: [
            { label: 'Quality', value: '100%' },
            { label: 'Returns', value: '0%' }
        ]
    },
    {
        icon: Users,
        label: 'Our Philosophy',
        title: 'Community, Not Just Customers',
        description: 'We are more than a shop; we are a styling partner. From our transparent pricing to our personalized consultation, we treat every interaction as a relationship. When you wear Ace, you wear confidence. Our salon services ensure that your investment is maintained, styled, and perfect for every occasion.',
        image: '/service.jpeg',
        stats: [
            { label: 'Followers', value: '36k' },
            { label: 'Rating', value: '5.0' }
        ]
    }
];

const AboutSection = ({ section, index }: { section: typeof contentSections[0]; index: number }) => {
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
                    <span className="text-primary text-sm tracking-[0.2em] uppercase font-bold">{section.label}</span>
                </div>

                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
                    {section.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 3 === 0 && i !== 0 ? 'text-primary italic' : ''}>{word} </span>
                    ))}
                </h3>

                <p className="text-foreground-muted text-lg leading-relaxed mb-10 max-w-xl">
                    {section.description}
                </p>

                {/* Micro-Stats / Highlights */}
                <div className="flex gap-12 border-t border-white/10 pt-8">
                    {section.stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-3xl font-serif text-white mb-1">{stat.value}</div>
                            <div className="text-xs uppercase tracking-widest text-primary-dim">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual Side */}
            <div className="flex-1 relative min-h-[400px] md:min-h-full group overflow-hidden">
                {/* Image Container with Parallax Effect */}
                <div className="absolute inset-0 transition-transform duration-700 hover:scale-105">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${section.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Floating Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 rounded-full border border-white/10 backdrop-blur-sm flex items-center justify-center bg-black/20 group-hover:scale-110 transition-transform duration-500">
                        <section.icon className="w-12 h-12 text-white/80" />
                    </div>
                </div>

                {/* Decorative "Gold Box" corners */}
                <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-primary/30 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-primary/30 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
};

const AboutPage = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <div className="min-h-screen bg-background-void text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dim to-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Navigation (Back) - Removed as Navbar is now persistent */}

            {/* Hero Section */}
            <section className="relative h-[90vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0 select-none"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: 'url(/about-page-hero-img.png)' }}
                    />
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
                                Who We Are
                            </h2>
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1]">
                                The Ace <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-primary italic pr-2">
                                    Story
                                </span>
                            </h1>
                            <p className="text-foreground-muted text-lg md:text-xl max-w-lg font-light leading-relaxed mb-10 md:mr-auto">
                                Founded in North Legon. Driven by a passion for accessible luxury. We are rewriting the rules of hair styling in Ghana.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => document.getElementById('about-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-background-void rounded-full transition-all duration-300 backdrop-blur-sm tracking-widest uppercase text-xs font-bold"
                            >
                                Read Our Journey
                            </motion.button>
                        </motion.div>
                    </div>


                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/30 flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => document.getElementById('about-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </section>

            {/* About Content Grid - Split Sections */}
            <div id="about-grid" className="max-w-[none] py-24">
                {contentSections.map((section, index) => (
                    <AboutSection key={index} section={section} index={index} />
                ))}
            </div>

            {/* Call to Action - Parallax Strip */}
            <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
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
                            Experience the <span className="text-primary italic">Difference</span>
                        </h2>

                        <p className="text-foreground-muted max-w-xl mx-auto mb-12 text-lg md:text-xl font-light">
                            Visit us in North Legon or shop our collection online. Your perfect look awaits.
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
                                <span>Connect With Us</span>
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
