// Bingo card dimensions
export const BINGO_CARD_SIZE = 25;
export const BINGO_CARD_ROWS = 5;
export const BINGO_CARD_COLS = 5;

// Default bingo card configuration
export const DEFAULT_BINGO_CONFIG = {
  BINGO_MIN_NUMBER: 1,
  BINGO_MAX_NUMBER: 75,
  BINGO_CARD_NUMBERS_COUNT: BINGO_CARD_SIZE,
} as const;
