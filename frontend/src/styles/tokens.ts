// Design tokens from style guide
export const tokens = {
  // Colors (CSS custom properties for theme support)
  colors: {
    primary: 'var(--color-primary, #153E75)', // Federal Navy 700
    secondary: 'var(--color-secondary, #7A1F1F)', // Congressional Red 700
    accent: 'var(--color-accent, #B6862C)', // Federal Gold 600
    info: 'var(--color-info, #0A4AA6)', // Info Blue 700
    success: 'var(--color-success, #166534)', // Green 700
    warning: 'var(--color-warning, #92400E)', // Amber 700
    error: 'var(--color-error, #7A1F1F)', // Red 700
    
    text: {
      primary: 'var(--color-text-primary, #101828)',
      secondary: 'var(--color-text-secondary, #344054)',
      muted: 'var(--color-text-muted, #667085)',
      inverse: 'var(--color-text-inverse, #FFFFFF)',
    },
    
    surface: {
      base: 'var(--color-surface-base, #F9FAFB)',
      alt: 'var(--color-surface-alt, #F0F4F8)',
      white: 'var(--color-surface-white, #FFFFFF)',
      black: 'var(--color-surface-black, #000000)',
    },
    
    gray: {
      50: 'var(--color-gray-50, #F9FAFB)',
      100: 'var(--color-gray-100, #F3F4F6)',
      200: 'var(--color-gray-200, #E5E7EB)',
      300: 'var(--color-gray-300, #D1D5DB)',
      400: 'var(--color-gray-400, #9CA3AF)',
      500: 'var(--color-gray-500, #6B7280)',
      600: 'var(--color-gray-600, #4B5563)',
      700: 'var(--color-gray-700, #344054)',
      800: 'var(--color-gray-800, #1F2937)',
      900: 'var(--color-gray-900, #101828)',
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