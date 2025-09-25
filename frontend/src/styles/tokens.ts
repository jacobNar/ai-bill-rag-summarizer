// Design tokens from style guide
export const tokens = {
  // Colors
  colors: {
    primary: '#153E75', // Federal Navy 700
    secondary: '#7A1F1F', // Congressional Red 700
    accent: '#B6862C', // Federal Gold 600
    info: '#0A4AA6', // Info Blue 700
    success: '#166534', // Green 700
    warning: '#92400E', // Amber 700
    error: '#7A1F1F', // Red 700
    
    text: {
      primary: '#101828', // Gray 900
      secondary: '#344054', // Gray 700
      muted: '#667085',
      inverse: '#FFFFFF',
    },
    
    surface: {
      base: '#F9FAFB', // Gray 50
      alt: '#F0F4F8', // Soft Blue 50
      white: '#FFFFFF',
      black: '#000000',
    },
    
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#344054',
      800: '#1F2937',
      900: '#101828',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    
    fontSize: {
      display: '48px',
      h1: '36px',
      h2: '30px',
      h3: '24px',
      h4: '20px',
      bodyL: '18px',
      body: '16px',
      small: '14px',
      xs: '12px',
      code: '13px',
    },
    
    lineHeight: {
      display: '56px',
      h1: '44px',
      h2: '38px',
      h3: '32px',
      h4: '28px',
      bodyL: '28px',
      body: '24px',
      small: '20px',
      xs: '16px',
      code: '20px',
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing (8pt system)
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
  },
  
  // Border Radius
  radii: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '999px',
  },
  
  // Shadows/Elevation
  shadows: {
    none: 'none',
    e1: '0 1px 2px rgba(16,24,40,.06), 0 1px 1px rgba(16,24,40,.04)',
    e2: '0 4px 16px rgba(16,24,40,.12)',
    e3: '0 8px 28px rgba(16,24,40,.24)',
    focus: '0 0 0 3px rgba(10,74,166,.25)', // Info blue with opacity
  },
  
  // Z-index
  zIndex: {
    skiplink: 1200,
    header: 1100,
    overlay: 1300,
    modal: 1400,
    toast: 1500,
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '350ms ease',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1440px',
  },
};

export type Tokens = typeof tokens;