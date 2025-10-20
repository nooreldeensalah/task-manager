export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  smPlus: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const CONTAINER_MAX_WIDTH = 960;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const TYPOGRAPHY = {
  titleLg: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  titleMd: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
} as const;

export const getResponsivePadding = (width: number) => {
  if (width >= BREAKPOINTS.desktop) {
    return SPACING.xl;
  }

  if (width >= BREAKPOINTS.tablet) {
    return SPACING.lg;
  }

  return SPACING.md;
};
