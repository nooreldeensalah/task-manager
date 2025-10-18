export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const CONTAINER_MAX_WIDTH = 960;

export const getResponsivePadding = (width: number) => {
  if (width >= BREAKPOINTS.desktop) {
    return SPACING.xl;
  }

  if (width >= BREAKPOINTS.tablet) {
    return SPACING.lg;
  }

  return SPACING.md;
};

export const getContainerWidth = (width: number) => {
  if (width >= BREAKPOINTS.desktop) {
    return CONTAINER_MAX_WIDTH;
  }

  const horizontalPadding = getResponsivePadding(width) * 2;
  return Math.max(width - horizontalPadding, 320);
};
