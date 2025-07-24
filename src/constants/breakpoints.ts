export const BREAKPOINTS = {
  SM: 480, // $breakpoint-sm
  MD: 768, // $breakpoint-md
  LG: 1024, // $breakpoint-lg
  XL: 1200, // $breakpoint-xl
  XXL: 1440, // $breakpoint-xxl
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export const isBelowBreakpoint = (
  width: number,
  breakpoint: BreakpointKey
): boolean => {
  return width <= BREAKPOINTS[breakpoint];
};

export const isAboveBreakpoint = (
  width: number,
  breakpoint: BreakpointKey
): boolean => {
  return width > BREAKPOINTS[breakpoint];
};
