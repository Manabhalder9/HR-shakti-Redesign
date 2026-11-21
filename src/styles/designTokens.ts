/**
 * HRShakti — Master Design System Token Registry (Preparation Phase)
 * Brand: HRShakti | Tagline: People. Knowledge. Possibilities.
 *
 * Unapplied reference tokens prepared for gradual dark-theme and light-theme
 * rollout without altering the current application's active styling.
 */

export const brandIdentity = {
  name: 'HRShakti',
  tagline: 'People. Knowledge. Possibilities.',
  accessibilityStandard: 'WCAG 2.2 AA',
  iconLibrary: 'lucide-react',
} as const;

export const brandPalette = {
  'color/brand/navy': '#142D4E',
  'color/brand/teal': '#168C83',
  'color/text/primary': '#242B35',
  'color/text/secondary': '#64748B',
  'color/text/muted': '#94A3B8',
  'color/border/default': '#E7EDF2',
  'color/status/success': '#16845B',
  'color/status/success-bg': '#EAF6EF',
  'color/status/warning': '#C58A28',
  'color/status/warning-bg': '#FFF6E5',
  'color/status/error': '#D94A4A',
  'color/status/error-bg': '#FDECEC',
  'color/status/information': '#3976B8',
  'color/status/information-bg': '#EDF4FC',
} as const;

export interface SemanticThemeTokens {
  'color/background/primary': string;
  'color/background/subtle': string;
  'color/surface/primary': string;
  'color/surface/elevated': string;
  'color/surface/muted': string;
  'color/text/primary': string;
  'color/text/secondary': string;
  'color/text/muted': string;
  'color/text/inverse': string;
  'color/border/default': string;
  'color/border/strong': string;
  'color/brand/navy': string;
  'color/brand/teal': string;
  'color/interactive/default': string;
  'color/interactive/hover': string;
  'color/interactive/active': string;
  'color/interactive/subtle': string;
  'color/interactive/text': string;
  'color/focus/ring': string;
  'color/status/success': string;
  'color/status/success-bg': string;
  'color/status/warning': string;
  'color/status/warning-bg': string;
  'color/status/error': string;
  'color/status/error-bg': string;
  'color/status/information': string;
  'color/status/information-bg': string;
}

export const lightThemeTokens: SemanticThemeTokens = {
  'color/background/primary': '#F5F7FA',
  'color/background/subtle': '#EEF2F6',
  'color/surface/primary': '#FFFFFF',
  'color/surface/elevated': '#FFFFFF',
  'color/surface/muted': '#F8FAFC',
  'color/text/primary': '#242B35',
  'color/text/secondary': '#64748B',
  'color/text/muted': '#94A3B8',
  'color/text/inverse': '#FFFFFF',
  'color/border/default': '#E7EDF2',
  'color/border/strong': '#CBD5E1',
  'color/brand/navy': '#142D4E',
  'color/brand/teal': '#168C83',
  'color/interactive/default': '#168C83',
  'color/interactive/hover': '#12756D',
  'color/interactive/active': '#0F5F59',
  'color/interactive/subtle': '#E8F5F4',
  'color/interactive/text': '#11736B',
  'color/focus/ring': 'rgba(22, 140, 131, 0.35)',
  'color/status/success': '#16845B',
  'color/status/success-bg': '#EAF6EF',
  'color/status/warning': '#C58A28',
  'color/status/warning-bg': '#FFF6E5',
  'color/status/error': '#D94A4A',
  'color/status/error-bg': '#FDECEC',
  'color/status/information': '#3976B8',
  'color/status/information-bg': '#EDF4FC',
};

export const darkThemeTokens: SemanticThemeTokens = {
  'color/background/primary': '#101923',
  'color/background/subtle': '#0D151E',
  'color/surface/primary': '#172330',
  'color/surface/elevated': '#1D2B39',
  'color/surface/muted': '#131E2A',
  'color/text/primary': '#F1F5F9',
  'color/text/secondary': '#A7B3C2',
  'color/text/muted': '#7F8D9D',
  'color/text/inverse': '#101923',
  'color/border/default': '#2B3A49',
  'color/border/strong': '#394B5E',
  'color/brand/navy': '#142D4E',
  'color/brand/teal': '#168C83',
  'color/interactive/default': '#168C83',
  'color/interactive/hover': '#1AA399',
  'color/interactive/active': '#12756D',
  'color/interactive/subtle': 'rgba(22, 140, 131, 0.16)',
  'color/interactive/text': '#2FC4B8',
  'color/focus/ring': 'rgba(47, 196, 184, 0.40)',
  'color/status/success': '#2BB67D',
  'color/status/success-bg': '#132B24',
  'color/status/warning': '#E0A63E',
  'color/status/warning-bg': '#2B2314',
  'color/status/error': '#EF6B6B',
  'color/status/error-bg': '#2F191C',
  'color/status/information': '#5FA0E0',
  'color/status/information-bg': '#152538',
};

export const typographyTokens = {
  'font/family/primary': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  scale: {
    'font/display/large': { fontSize: '48px', lineHeight: '56px', fontWeight: 700, letterSpacing: '-0.025em' },
    'font/display/medium': { fontSize: '40px', lineHeight: '48px', fontWeight: 700, letterSpacing: '-0.02em' },
    'font/heading/h1': { fontSize: '32px', lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.02em' },
    'font/heading/h2': { fontSize: '24px', lineHeight: '32px', fontWeight: 600, letterSpacing: '-0.015em' },
    'font/heading/h3': { fontSize: '20px', lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.01em' },
    'font/heading/h4': { fontSize: '16px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0em' },
    'font/body/large': { fontSize: '16px', lineHeight: '26px', fontWeight: 400 },
    'font/body/default': { fontSize: '14px', lineHeight: '22px', fontWeight: 400 },
    'font/body/small': { fontSize: '13px', lineHeight: '20px', fontWeight: 400 },
    'font/label/default': { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
  },
} as const;

export const spacingTokens = {
  'spacing/4': '4px',
  'spacing/8': '8px',
  'spacing/12': '12px',
  'spacing/16': '16px',
  'spacing/20': '20px',
  'spacing/24': '24px',
  'spacing/32': '32px',
  'spacing/40': '40px',
  'spacing/48': '48px',
  'spacing/64': '64px',
  'spacing/80': '80px',
  'spacing/96': '96px',
} as const;

export const radiusTokens = {
  'radius/sm': '4px',
  'radius/md': '8px',
  'radius/lg': '12px',
  'radius/full': '9999px',
} as const;

export const shadowTokens = {
  light: {
    'shadow/sm': '0 1px 2px rgba(20, 45, 78, 0.05)',
    'shadow/md': '0 4px 12px rgba(20, 45, 78, 0.07)',
    'shadow/lg': '0 12px 28px rgba(20, 45, 78, 0.10)',
  },
  dark: {
    'shadow/sm': '0 1px 2px rgba(0, 0, 0, 0.25)',
    'shadow/md': '0 6px 16px rgba(0, 0, 0, 0.32)',
    'shadow/lg': '0 16px 36px rgba(0, 0, 0, 0.42)',
  },
} as const;

export const layoutMetrics = {
  publicMaxWidth: '1200px–1280px',
  dashboardSidebarWidth: '248px',
  dashboardSidebarCollapsedWidth: '76px',
  dashboardTopbarHeight: '68px',
  dashboardPagePadding: '32px',
  breakpoints: {
    mobileMax: '767px',
    tabletMin: '768px',
    tabletMax: '1023px',
    desktopMin: '1024px',
  },
  iconSizes: {
    compact: 16,
    standard: 18,
    navigation: 20,
    prominent: 24,
    feature: 32,
  },
} as const;
