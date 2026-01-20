/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: '#0F0A06', // coffee
                    void: '#050302',
                    wood: '#1E140F',
                    card: '#2A1B12',
                    glass: 'rgba(42, 27, 18, 0.4)',
                },
                primary: {
                    DEFAULT: '#E6C075', // gold
                    light: '#F3D9A0',
                    dim: '#B08D55',
                },
                accent: {
                    DEFAULT: '#5D4037', // leather/brown
                    hover: '#795548',
                },
                foreground: {
                    DEFAULT: '#F2F2F2', // primary text
                    muted: '#D4C5B9',   // secondary text
                    dim: '#9CA3AF',     // tertiary
                },
                border: {
                    DEFAULT: 'rgba(230, 192, 117, 0.1)',
                    subtle: 'rgba(230, 192, 117, 0.1)',
                    highlight: 'rgba(230, 192, 117, 0.3)',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
            },
            borderRadius: {
                'xs': '2px',
                'sm': '4px',
                'md': '6px',
                'lg': '12px',
                'xl': '24px',
                '2xl': '32px',
            },
            boxShadow: {
                'gold': '0 10px 40px -10px rgba(230, 192, 117, 0.1)',
                'deep': '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
            },
            letterSpacing: {
                'widest': '0.2em',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
