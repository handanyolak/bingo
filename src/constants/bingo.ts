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

// Drawing animation timing constants
export const DRAWN_NUMBER_TOTAL_INTERVAL_MS = 2000;
export const DRAWN_NUMBER_INTERVAL_SEC = DRAWN_NUMBER_TOTAL_INTERVAL_MS / 1000;
export const DRAWN_NUMBER_DISPLAY_DURATION_MS = 1500;
export const DRAWN_NUMBER_TRANSITION_MS = 500;
export const NUMBER_DRAWING_INITIAL_DELAY_SEC = 10;
