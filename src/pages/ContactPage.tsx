import React from 'react';
import { Phone, MapPin, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
    // Animation container for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-background-void text-foreground font-sans pt-20">
            <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
                {/* Background Image - Salon */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{ backgroundImage: "url('/salon-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-start">
                        {/* Glass Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full md:w-1/2 p-10 md:p-14 bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-serif text-4xl md:text-5xl text-white mb-4"
                            >
                                Contact Us
                            </motion.h2>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="w-16 h-1 bg-primary mb-12 origin-left"
                            />

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-10"
                            >
                                {/* Phone */}
                                <motion.div variants={itemVariants} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-background-void transition-all duration-300 shadow-lg group-hover:scale-110">
                                        <Phone className="w-6 h-6 text-primary group-hover:text-background-void transition-colors" />
                                    </div>
                                    <div className="flex-1 border-b border-white/10 pb-4 group-hover:border-primary/50 transition-colors">
                                        <p className="text-xs uppercase tracking-widest text-primary/80 mb-1 font-bold">Phone</p>
                                        <p className="text-xl md:text-2xl text-white font-serif tracking-wide group-hover:text-primary-light transition-colors">+233 249 494 156</p>
                                    </div>
                                </motion.div>

                                {/* Address */}
                                <motion.div variants={itemVariants} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-background-void transition-all duration-300 shadow-lg group-hover:scale-110">
                                        <MapPin className="w-6 h-6 text-primary group-hover:text-background-void transition-colors" />
                                    </div>
                                    <div className="flex-1 border-b border-white/10 pb-4 group-hover:border-primary/50 transition-colors">
                                        <p className="text-xs uppercase tracking-widest text-primary/80 mb-1 font-bold">Address</p>
                                        <p className="text-xl md:text-2xl text-white font-serif tracking-wide group-hover:text-primary-light transition-colors">North Legon, Accra</p>
                                    </div>
                                </motion.div>

                                {/* Website */}
                                <motion.div variants={itemVariants} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-background-void transition-all duration-300 shadow-lg group-hover:scale-110">
                                        <Globe className="w-6 h-6 text-primary group-hover:text-background-void transition-colors" />
                                    </div>
                                    <div className="flex-1 border-b border-white/10 pb-4 group-hover:border-primary/50 transition-colors">
                                        <p className="text-xs uppercase tracking-widest text-primary/80 mb-1 font-bold">Website</p>
                                        <p className="text-xl md:text-2xl text-white font-serif tracking-wide group-hover:text-primary-light transition-colors">www.acewigs.com</p>
                                    </div>
                                </motion.div>

                                {/* Email */}
                                <motion.div variants={itemVariants} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-background-void transition-all duration-300 shadow-lg group-hover:scale-110">
                                        <Mail className="w-6 h-6 text-primary group-hover:text-background-void transition-colors" />
                                    </div>
                                    <div className="flex-1 border-b border-white/10 pb-4 group-hover:border-primary/50 transition-colors">
                                        <p className="text-xs uppercase tracking-widest text-primary/80 mb-1 font-bold">Email</p>
                                        <p className="text-xl md:text-2xl text-white font-serif tracking-wide group-hover:text-primary-light transition-colors">contact@acewigs.com</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
