export const theme = {
  colors: {
    primary: {
      main: '#2D5F3F',
      hover: '#36503F',
      active: '#1A3323',
      light: '#83A58F',
      lighter: '#73FAA4',
      dark: '#1A3323'
    },
    neutral: {
      white: '#FFFFFF',
      gray50: '#F7F7F7',
      gray100: '#F2F2F2',
      gray200: '#E8E8E8',
      gray300: '#D8D8D8',
      gray400: '#AAAAAA',
      gray500: '#666666',
      gray600: '#3D3D3D',
      gray900: '#111111',
      black: '#000000'
    },
    semantic: {
      success: '#2D5F3F',
      warning: '#FF9500',
      error: '#FF4757',
      info: '#5352ED'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F7F7F7',
      accent: '#E8F0EB',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
      muted: '#AAAAAA',
      inverse: '#FFFFFF',
      link: '#1A3323',
      linkHover: '#2D5F3F'
    },
    border: {
      light: '#E8E8E8',
      medium: '#D8D8D8',
      dark: '#AAAAAA',
      focus: '#111111',
      primary: '#2D5F3F'
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