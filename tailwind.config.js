/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Strategy colors from Teable
        educate: {
          light: '#DBEAFE',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8'
        },
        engage: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#059669'
        },
        authority: {
          light: '#EDE9FE',
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED'
        },
        story: {
          light: '#FFEDD5',
          DEFAULT: '#F97316',
          dark: '#EA580C'
        },
        promote: {
          light: '#FFE4E6',
          DEFAULT: '#EC4899',
          dark: '#DB2777'
        },
        // Status colors
        status: {
          draft: '#94A3B8',
          generated: '#64748B',
          client_review: '#F59E0B',
          changes_requested: '#EF4444',
          approved: '#10B981',
          scheduled: '#3B82F6',
          published: '#059669',
          rejected: '#DC2626'
        },
        // Neutral palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}