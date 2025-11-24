/**
 * Spacing System
 * Design system spacing tokens, container max-widths, and breakpoints
 */

export const spacing = {
  // Base spacing scale (4px base unit)
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  base: '1rem',    // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const containerMaxWidths = {
  sm: '40rem',     // 640px
  md: '48rem',     // 768px
  lg: '64rem',     // 1024px
  xl: '80rem',     // 1280px
};

export const breakpoints = {
  mobile: '20rem',   // 320px
  tablet: '48rem',   // 768px
  desktop: '64rem',  // 1024px
  wide: '90rem',     // 1440px
};

export default {
  spacing,
  containerMaxWidths,
  breakpoints,
};

