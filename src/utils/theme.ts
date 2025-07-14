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

// Color validation utility
export const isValidColor = (color?: string): color is string =>
  typeof color === "string" && !color.includes("NaN");

// RGB conversion utility
export const getRGBValues = (color: string): [number, number, number] => {
  if (color.startsWith("rgb")) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return rgbMatch
      ? (rgbMatch.slice(1).map(Number) as [number, number, number])
      : FALLBACK_RGB;
  }
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    if (hex.length === THEME_CONSTANTS.HEX_COLOR_LENGTH) {
      return [
        parseInt(
          hex.substring(
            THEME_CONSTANTS.HEX_INDICES.RED.START,
            THEME_CONSTANTS.HEX_INDICES.RED.END
          ),
          16
        ),
        parseInt(
          hex.substring(
            THEME_CONSTANTS.HEX_INDICES.GREEN.START,
            THEME_CONSTANTS.HEX_INDICES.GREEN.END
          ),
          16
        ),
        parseInt(
          hex.substring(
            THEME_CONSTANTS.HEX_INDICES.BLUE.START,
            THEME_CONSTANTS.HEX_INDICES.BLUE.END
          ),
          16
        ),
      ];
    }
  }
  return FALLBACK_RGB;
};

// Generate deterministic colors from address
export const generateColorsFromAddress = (
  address: string | null | undefined
): string[] => {
  const addressToUse = address || zeroAddress;
  const cleanAddress = addressToUse.slice(THEME_CONSTANTS.COLOR_SEGMENT_START);
  const addressBuffer = Buffer.from(cleanAddress, "hex");
  const hash = keccak256(addressBuffer);
  const hexSegment = hash.slice(
    THEME_CONSTANTS.COLOR_SEGMENT_START,
    THEME_CONSTANTS.COLOR_SEGMENT_END
  );

  const colors: string[] = [];
  for (let i = 0; i < COLOR_PALETTE_SIZE; i++) {
    const segment = hexSegment.slice(
      i * THEME_CONSTANTS.HEX_SEGMENT_LENGTH,
      i * THEME_CONSTANTS.HEX_SEGMENT_LENGTH +
        THEME_CONSTANTS.HEX_SEGMENT_LENGTH
    );
    if (segment.length === THEME_CONSTANTS.HEX_SEGMENT_LENGTH) {
      const r =
        parseInt(segment[THEME_CONSTANTS.COLOR_INDICES[0]], 16) *
          COLOR_MULTIPLIER +
        COLOR_OFFSET;
      const g =
        parseInt(segment[THEME_CONSTANTS.COLOR_INDICES[1]], 16) *
          COLOR_MULTIPLIER +
        COLOR_OFFSET;
      const b =
        parseInt(segment[THEME_CONSTANTS.COLOR_INDICES[2]], 16) *
          COLOR_MULTIPLIER +
        COLOR_OFFSET;

      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
  }

  return colors;
};

// CSS Variables Manager Class for better encapsulation
export class ThemeStyleManager {
  private root: HTMLElement;

  constructor() {
    if (typeof window !== "undefined") {
      this.root = document.documentElement;
    } else {
      // SSR fallback
      this.root = {} as HTMLElement;
    }
  }

  private setVariable(name: string, value: string): void {
    if (this.root.style) {
      this.root.style.setProperty(name, value);
    }
  }

  private setRGBAVariable(
    name: string,
    r: number,
    g: number,
    b: number,
    opacity: number
  ): void {
    this.setVariable(name, `rgba(${r}, ${g}, ${b}, ${opacity})`);
  }

  updateThemeVariables(
    currentColor: string,
    lightColor: string,
    darkColor: string,
    theme: string
  ): void {
    const [r, g, b] = getRGBValues(currentColor);
    const isDark = theme === "dark";

    // Set blob colors
    const blobOpacity = isDark
      ? THEME_CONSTANTS.BLOB_OPACITY.DARK
      : THEME_CONSTANTS.BLOB_OPACITY.LIGHT;

    THEME_CONSTANTS.BLOB_OPACITY.MULTIPLIERS.forEach((multiplier, index) => {
      this.setRGBAVariable(
        `--blob-color-${index + 1}`,
        r,
        g,
        b,
        blobOpacity * multiplier
      );
    });

    // Set theme colors
    this.setVariable("--theme-color", currentColor);
    this.setVariable("--theme-color-light", lightColor);
    this.setVariable("--theme-color-dark", darkColor);
    this.setVariable("--theme-color-rgb", `${r}, ${g}, ${b}`);

    // Set letter colors
    const letterOpacity = isDark
      ? THEME_CONSTANTS.LETTER_OPACITY.DARK
      : THEME_CONSTANTS.LETTER_OPACITY.LIGHT;

    THEME_CONSTANTS.LETTER_OPACITY.MULTIPLIERS.forEach((multiplier, index) => {
      this.setRGBAVariable(
        `--letter-color-${index + 1}`,
        r,
        g,
        b,
        letterOpacity * multiplier
      );
    });

    // Update themed backgrounds
    const borderOpacity = isDark
      ? THEME_CONSTANTS.BORDER_OPACITY.DARK
      : THEME_CONSTANTS.BORDER_OPACITY.LIGHT;
    this.updateThemedBackgrounds(r, g, b, borderOpacity);
  }

  private updateThemedBackgrounds(
    r: number,
    g: number,
    b: number,
    opacity: number
  ): void {
    if (typeof window !== "undefined") {
      document.querySelectorAll(".bingo-themed-bg").forEach((el) => {
        (
          el as HTMLElement
        ).style.borderColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      });
    }
  }
}

// Color calculations utilities
export const calculateColorVariants = (color: string) => ({
  light: lighten(COLOR_LIGHTNESS_FACTOR, color),
  dark: darken(COLOR_LIGHTNESS_FACTOR, color),
});

// Storage key utility
export const STORAGE_KEYS = {
  COLOR_INDEX: "selectedColorIndex",
} as const;
