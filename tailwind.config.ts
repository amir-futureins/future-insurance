import type { Config } from 'tailwindcss';

/**
 * "Light Navy & Gold" — crisp, bright luxury fintech built on the Future
 * Insurance logo. Exact brand colours sampled from the logo: Deep Navy #142B55
 * and Warm Gold #D4A24A. The canvas is a soft slate-cream (#F0F4F8); NAVY is
 * the high-contrast type + line language on white surfaces, and GOLD is the
 * house accent that drives the recommendation system and primary CTAs (gold
 * fill / navy text). Each provider keeps its own brand hex — tuned to stay
 * legible on the light surfaces.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ergonomic soft slate-cream canvas — easy on the eyes vs stark white.
        base: '#F0F4F8',
        navy: { DEFAULT: '#142B55', deep: '#0F2141', light: '#22366A' },
        gold: {
          DEFAULT: '#D4A24A', // brand gold — fills, icons, decorative accents
          bright: '#E1B665', // gradient / hover
          deep: '#8A6220', // deep "gold ink" — legible gold TEXT on light (AA ≥4.5:1)
          tint: 'rgba(212,162,74,0.14)',
        },
        ink: '#142B55', // primary text = deep navy (crisp, high contrast)
        muted: '#4E5D7A', // secondary text on light (~6.5:1)
        faint: '#5B6885', // footnotes / placeholders (AA ≥4.5:1 on white)
        // Alias so existing accent-* utilities resolve to the gold house accent.
        accent: {
          DEFAULT: '#D4A24A',
          hover: '#B98C42',
          tint: 'rgba(212,162,74,0.14)',
        },
        // Provider brand truths + `glow` = the brand hex tuned legible on light.
        pc: { DEFAULT: '#E11933', glow: '#DC2626' },
        harel: {
          blue: '#0057B8',
          glow: '#0057B8',
          yellow: '#FFC20E',
          green: '#16A34A',
        },
        clal: { DEFAULT: '#00A0DF', glow: '#0086BC' },
        // Migdal — royal blue with an orange accent.
        migdal: { DEFAULT: '#003399', glow: '#003399', orange: '#F5821F' },
      },
      fontFamily: {
        sans: [
          'var(--font-assistant)',
          'Assistant',
          "'Helvetica Neue'",
          'Arial',
          'system-ui',
          '-apple-system',
          "'Segoe UI'",
          'sans-serif',
        ],
      },
      backgroundImage: {
        'cta-fill': 'linear-gradient(135deg, #E1B665 0%, #C6924A 100%)',
        'cta-glow':
          'radial-gradient(120px 60px at 50% 120%, rgba(212,162,74,0.55) 0%, rgba(212,162,74,0) 70%)',
        'recommend-highlight':
          'radial-gradient(80% 120% at 50% 0%, rgba(212,162,74,0.26) 0%, rgba(212,162,74,0) 70%)',
        'recommend-tint':
          'linear-gradient(180deg, rgba(212,162,74,0.10) 0%, rgba(212,162,74,0) 60%)',
        'glow-gold':
          'radial-gradient(circle at center, rgba(212,162,74,0.40) 0%, rgba(212,162,74,0) 70%)',
        'glow-navy':
          'radial-gradient(circle at center, rgba(58,96,180,0.42) 0%, rgba(58,96,180,0) 70%)',
        'glow-royal':
          'radial-gradient(circle at center, rgba(79,134,255,0.30) 0%, rgba(79,134,255,0) 70%)',
      },
      borderRadius: {
        glass: '20px',
        'glass-lg': '24px',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'reveal-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'badge-drop': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '70%': { opacity: '1', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'content-swap': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(4%, -3%, 0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.85)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(12px)' },
        },
        'dash-flow': {
          to: { 'stroke-dashoffset': '-100' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(14px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 8px 20px -8px rgba(212,162,74,0.55)' },
          '50%': {
            boxShadow:
              '0 8px 20px -8px rgba(212,162,74,0.7), 0 0 22px 1px rgba(212,162,74,0.5)',
          },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'orb-pulse': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        sheen: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'bubble-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'grow-x': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'grow-y': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
        scan: {
          '0%': { top: '-6%', opacity: '0' },
          '12%': { opacity: '0.9' },
          '88%': { opacity: '0.9' },
          '100%': { top: '106%', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'nudge-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        },
        'drawer-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Expanding red aura for the persistent purchase bar on /fly. The gold
        // `pulse-glow` above is the house accent and reads wrong on a red CTA.
        'red-pulse': {
          '0%, 100%': {
            boxShadow: '0 8px 22px rgba(227,6,19,0.30), 0 0 0 0 rgba(227,6,19,0.55)',
          },
          '70%': {
            boxShadow: '0 12px 28px rgba(227,6,19,0.34), 0 0 0 16px rgba(227,6,19,0)',
          },
        },
        // White halo pulse for the CTA embedded in the red charged card on /fly.
        // The gold `pulse-glow` above is invisible against a red surface.
        'pill-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.18), 0 0 0 0 rgba(255,255,255,0.65)',
          },
          '55%': {
            transform: 'scale(1.035)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.22), 0 0 0 12px rgba(255,255,255,0)',
          },
        },
      },
      animation: {
        breathe: 'breathe 2.4s ease-in-out infinite',
        'reveal-up': 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'badge-drop': 'badge-drop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'content-swap': 'content-swap 0.18s ease-out both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'drift-slow': 'drift 22s ease-in-out infinite',
        'drift-slower': 'drift 30s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        'float-y': 'float-y 9s ease-in-out infinite',
        'float-x': 'float-x 11s ease-in-out infinite',
        'dash-flow': 'dash-flow 3s linear infinite',
        'slide-in': 'slide-in 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-glow': 'pulse-glow 2.8s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'orb-pulse': 'orb-pulse 10s ease-in-out infinite',
        sheen: 'sheen 3.2s linear infinite',
        'bubble-in': 'bubble-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'grow-x': 'grow-x 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'grow-y': 'grow-y 0.8s cubic-bezier(0.16,1,0.3,1) both',
        scan: 'scan 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'nudge-x': 'nudge-x 2.6s ease-in-out infinite',
        'drawer-in': 'drawer-in 0.32s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'pill-pulse': 'pill-pulse 1.9s ease-in-out infinite',
        'red-pulse': 'red-pulse 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
