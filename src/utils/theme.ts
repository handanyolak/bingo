import { lighten, darken } from "polished";
import { keccak256, zeroAddress } from "viem";

import {
  FALLBACK_RGB,
  COLOR_MULTIPLIER,
  COLOR_OFFSET,
  COLOR_LIGHTNESS_FACTOR,
  COLOR_PALETTE_SIZE,
  THEME_CONSTANTS,
} from "@/constants";

// Parses an RGB string of the form "rgb(r, g, b)".
// Returns a tuple [r, g, b] or null if parsing fails.
const parseRgbString = (color: string): [number, number, number] | null => {
  const match = color.match(
    /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/
  );
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
};

// Parses a hex color string of the form "#RRGGBB".
// Returns a tuple [r, g, b] or null if parsing fails.
const parseHexColor = (color: string): [number, number, number] | null => {
  const hex = color.replace("#", "");
  if (hex.length !== THEME_CONSTANTS.HEX_COLOR_LENGTH) return null;
  const { RED, GREEN, BLUE } = THEME_CONSTANTS.HEX_INDICES;
  const r = parseInt(hex.slice(RED.START, RED.END), 16);
  const g = parseInt(hex.slice(GREEN.START, GREEN.END), 16);
  const b = parseInt(hex.slice(BLUE.START, BLUE.END), 16);
  return [r, g, b];
};

// Returns RGB values for a given color string, or fallback if invalid.
export const getRGBValues = (color: string): [number, number, number] =>
  parseRgbString(color) ?? parseHexColor(color) ?? FALLBACK_RGB;

// Checks whether a string is a valid color (non-NaN).
export const isValidColor = (color?: string): color is string =>
  typeof color === "string" && !color.includes("NaN");

// Generates a deterministic color palette from an Ethereum address.
export const generateColorsFromAddress = (
  address?: string | null
): string[] => {
  const raw = (address || zeroAddress).slice(
    THEME_CONSTANTS.COLOR_SEGMENT_START
  );
  const hash = keccak256(Buffer.from(raw, "hex")).slice(
    THEME_CONSTANTS.COLOR_SEGMENT_START,
    THEME_CONSTANTS.COLOR_SEGMENT_END
  );
  const colors: string[] = [];

  for (let i = 0; i < COLOR_PALETTE_SIZE; i++) {
    const start = i * THEME_CONSTANTS.HEX_SEGMENT_LENGTH;
    const segment = hash.slice(
      start,
      start + THEME_CONSTANTS.HEX_SEGMENT_LENGTH
    );
    if (segment.length === THEME_CONSTANTS.HEX_SEGMENT_LENGTH) {
      const [r, g, b] = [0, 1, 2].map(
        (idx) => parseInt(segment[idx], 16) * COLOR_MULTIPLIER + COLOR_OFFSET
      ) as [number, number, number];
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
  }

  return colors;
};

// Sets a CSS variable on the document root.
const setCSSVar = (name: string, value: string): void =>
  document.documentElement.style.setProperty(name, value);

// Sets an RGBA CSS variable from an RGB tuple and alpha.
const setCSSVarRGBA = (
  name: string,
  [r, g, b]: [number, number, number],
  alpha: number
): void => setCSSVar(name, `rgba(${r}, ${g}, ${b}, ${alpha})`);

// Updates all theme-related CSS variables based on the given colors and mode.
export const updateThemeColors = (
  current: string,
  light: string,
  dark: string,
  mode: "light" | "dark"
): void => {
  if (typeof window === "undefined") return;
  const rgb = getRGBValues(current);
  const isDarkMode = mode === "dark";

  // Blob colors
  const baseBlobAlpha = isDarkMode
    ? THEME_CONSTANTS.BLOB_OPACITY.DARK
    : THEME_CONSTANTS.BLOB_OPACITY.LIGHT;
  THEME_CONSTANTS.BLOB_OPACITY.MULTIPLIERS.forEach((m, idx) => {
    setCSSVarRGBA(`--blob-color-${idx + 1}`, rgb, baseBlobAlpha * m);
  });

  // Core theme colors
  setCSSVar("--theme-color", current);
  setCSSVar("--theme-color-light", light);
  setCSSVar("--theme-color-dark", dark);
  setCSSVar("--theme-color-rgb", `${rgb.join(", ")}`);

  // Letter animation colors
  const baseLetterAlpha = isDarkMode
    ? THEME_CONSTANTS.LETTER_OPACITY.DARK
    : THEME_CONSTANTS.LETTER_OPACITY.LIGHT;
  THEME_CONSTANTS.LETTER_OPACITY.MULTIPLIERS.forEach((m, idx) => {
    setCSSVarRGBA(`--letter-color-${idx + 1}`, rgb, baseLetterAlpha * m);
  });

  // Bordered themed backgrounds
  const borderAlpha = isDarkMode
    ? THEME_CONSTANTS.BORDER_OPACITY.DARK
    : THEME_CONSTANTS.BORDER_OPACITY.LIGHT;
  document.querySelectorAll<HTMLElement>(".bingo-themed-bg").forEach((el) => {
    el.style.borderColor = `rgba(${rgb.join(", ")}, ${borderAlpha})`;
  });
};

// Calculates lighter and darker variants of a base color.
export const calculateColorVariants = (color: string) => ({
  light: lighten(COLOR_LIGHTNESS_FACTOR, color),
  dark: darken(COLOR_LIGHTNESS_FACTOR, color),
});

export const STORAGE_KEYS = {
  COLOR_INDEX: "selectedColorIndex",
} as const;
