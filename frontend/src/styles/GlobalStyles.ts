import { createGlobalStyle } from 'styled-components';
import { tokens } from './tokens';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Color CSS Custom Properties */
    --color-primary: ${tokens.colors.primary};
    --color-secondary: ${tokens.colors.secondary};
    --color-accent: ${tokens.colors.accent};
    --color-info: ${tokens.colors.info};
    --color-success: ${tokens.colors.success};
    --color-warning: ${tokens.colors.warning};
    --color-error: ${tokens.colors.error};
    
    --color-text: ${tokens.colors.text.primary};
    --color-text-secondary: ${tokens.colors.text.secondary};
    --color-text-muted: ${tokens.colors.text.muted};
    
    --color-surface: ${tokens.colors.surface.base};
    --color-surface-alt: ${tokens.colors.surface.alt};
    --color-white: ${tokens.colors.surface.white};
    
    /* Typography */
    --font-sans: ${tokens.typography.fontFamily.sans};
    --font-mono: ${tokens.typography.fontFamily.mono};
    
    /* Spacing */
    --space-1: ${tokens.spacing[1]};
    --space-2: ${tokens.spacing[2]};
    --space-3: ${tokens.spacing[3]};
    --space-4: ${tokens.spacing[4]};
    --space-5: ${tokens.spacing[5]};
    --space-6: ${tokens.spacing[6]};
    --space-8: ${tokens.spacing[8]};
    
    /* Radii */
    --radius-sm: ${tokens.radii.sm};
    --radius-md: ${tokens.radii.md};
    --radius-lg: ${tokens.radii.lg};
    
    /* Shadows */
    --shadow-e1: ${tokens.shadows.e1};
    --shadow-e2: ${tokens.shadows.e2};
    --shadow-e3: ${tokens.shadows.e3};
    
    /* Focus */
    --focus-ring: 3px solid ${tokens.colors.info};
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${tokens.typography.fontFamily.sans};
    font-size: ${tokens.typography.fontSize.body};
    line-height: ${tokens.typography.lineHeight.body};
    color: ${tokens.colors.text.primary};
    background: ${tokens.colors.surface.base};
    min-height: 100vh;
  }

  h1 {
    font-size: ${tokens.typography.fontSize.h1};
    line-height: ${tokens.typography.lineHeight.h1};
    font-weight: ${tokens.typography.fontWeight.bold};
  }

  h2 {
    font-size: ${tokens.typography.fontSize.h2};
    line-height: ${tokens.typography.lineHeight.h2};
    font-weight: ${tokens.typography.fontWeight.bold};
  }

  h3 {
    font-size: ${tokens.typography.fontSize.h3};
    line-height: ${tokens.typography.lineHeight.h3};
    font-weight: ${tokens.typography.fontWeight.semibold};
  }

  h4 {
    font-size: ${tokens.typography.fontSize.h4};
    line-height: ${tokens.typography.lineHeight.h4};
    font-weight: ${tokens.typography.fontWeight.semibold};
  }

  a {
    color: ${tokens.colors.info};
    text-decoration: none;
    transition: all ${tokens.transitions.fast};
    
    &:hover {
      text-decoration: underline;
    }
    
    &:focus-visible {
      outline: var(--focus-ring);
      outline-offset: 2px;
      border-radius: ${tokens.radii.sm};
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
  }

  code, pre {
    font-family: ${tokens.typography.fontFamily.mono};
    font-size: ${tokens.typography.fontSize.code};
    line-height: ${tokens.typography.lineHeight.code};
  }

  /* Skip link for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: ${tokens.colors.primary};
    color: ${tokens.colors.surface.white};
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    text-decoration: none;
    z-index: ${tokens.zIndex.skiplink};
    border-radius: ${tokens.radii.md};
    
    &:focus {
      top: ${tokens.spacing[2]};
      left: ${tokens.spacing[2]};
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;