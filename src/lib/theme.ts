export const theme = {
  colors: {
    primary: {
      main: 'rgb(var(--color-primary))',
      hover: 'rgb(var(--color-primary-hover))',
      active: 'rgb(var(--color-primary-active))',
      light: 'rgb(var(--color-primary-light))',
      lighter: 'rgb(var(--color-primary-lighter))',
      dark: 'rgb(var(--color-primary-active))'
    },
    neutral: {
      white: 'rgb(var(--color-white))',
      gray50: 'rgb(var(--color-gray-50))',
      gray100: 'rgb(var(--color-gray-100))',
      gray200: 'rgb(var(--color-gray-200))',
      gray300: 'rgb(var(--color-gray-300))',
      gray400: 'rgb(var(--color-gray-400))',
      gray500: 'rgb(var(--color-gray-500))',
      gray600: 'rgb(var(--color-gray-600))',
      gray900: 'rgb(var(--color-gray-900))',
      black: 'rgb(var(--color-black))'
    },
    semantic: {
      success: 'rgb(var(--color-success))',
      warning: 'rgb(var(--color-warning))',
      error: 'rgb(var(--color-error))',
      info: 'rgb(var(--color-info))'
    },
    background: {
      primary: 'rgb(var(--color-white))',
      secondary: 'rgb(var(--color-gray-50))',
      accent: 'rgba(var(--color-primary-light), 0.1)',
      overlay: 'rgba(var(--color-black), 0.5)'
    },
    text: {
      primary: 'rgb(var(--color-text-primary))',
      secondary: 'rgb(var(--color-text-secondary))',
      muted: 'rgb(var(--color-text-muted))',
      inverse: 'rgb(var(--color-white))',
      link: 'rgb(var(--color-primary-active))',
      linkHover: 'rgb(var(--color-primary))'
    },
    border: {
      light: 'rgb(var(--color-gray-200))',
      medium: 'rgb(var(--color-gray-300))',
      dark: 'rgb(var(--color-gray-400))',
      focus: 'rgb(var(--color-text-primary))',
      primary: 'rgb(var(--color-primary))'
    }
  },
  typography: {
    fontFamily: {
      primary: 'Pretendard Variable, ui-sans-serif, system-ui, -apple-system, Noto Sans, sans-serif',
      fallback: 'system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px',
      '5xl': '36px'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px'
  },
  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0px 2px 16px rgba(0, 0, 0, 0.08)',
    lg: '0px 14px 16px -24px rgba(0, 0, 0, 0.33)',
    xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0px 2px 4px 0px rgba(0, 0, 0, 0.06)'
  },
  animation: {
    duration: {
      fastest: '75ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
      slowest: '1000ms'
    },
    easing: {
      custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
} as const;