// Theme Color Constants
export const DEFAULT_COLOR = "rgb(209, 213, 219)";
export const FALLBACK_RGB: [number, number, number] = [158, 102, 171];

// Color Generation Constants
export const COLOR_MULTIPLIER = 10;
export const COLOR_OFFSET = 50;
export const COLOR_LIGHTNESS_FACTOR = 0.1;

// Color Palette Size
export const COLOR_PALETTE_SIZE = 10;

// Comprehensive Theme Constants
export const THEME_CONSTANTS = {
  HEX_SEGMENT_LENGTH: 3,
  COLOR_SEGMENT_START: 2,
  COLOR_SEGMENT_END: 32,
  HEX_COLOR_LENGTH: 6,
  HEX_INDICES: {
    RED: { START: 0, END: 2 },
    GREEN: { START: 2, END: 4 },
    BLUE: { START: 4, END: 6 },
  },
  COLOR_INDICES: [0, 1, 2] as const,
  BLOB_OPACITY: {
    DARK: 0.9,
    LIGHT: 0.98,
    MULTIPLIERS: [1, 0.85, 0.7] as const,
  },
  BORDER_OPACITY: {
    DARK: 0.7,
    LIGHT: 0.6,
  },
  LETTER_OPACITY: {
    DARK: 0.45,
    LIGHT: 0.4,
    MULTIPLIERS: [1, 0.95, 0.9] as const,
  },
} as const;
