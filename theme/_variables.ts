// This file is not in use ATM.
// Could be a starting point to gather variables and styles for theming.
import mix from "./_mix";

const white = "#ffffff";
const black = "#000000";

// COLOR PALETTE

// Base palette
export const basePalette = {
  // colorPrimary: "#ffffff",
  colorPrimary: "#8EA36B",
  colorSecondary: "#6C87A3",
  colorAccent: "#A2866A",
  colorGray: "#888888",
  colorWarning: "#C41E3A",
};

// Shading factors
const shadingFactors = {
  colorVariationRatioLess: 20,
  colorVariationRatioBase: 45,
  colorVariationRatioMore: 65,
  colorVariationRatioMost: 85,
};

export const advancedPalette = {
  colorPrimaryDarkest: mix(
    black,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioMost
  ),
  colorPrimaryDarker: mix(
    black,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioMore
  ),
  colorPrimaryDark: mix(
    black,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioBase
  ),
  colorPrimaryDarky: mix(
    black,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioLess
  ),
  colorPrimaryLighty: mix(
    white,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioLess
  ),
  colorPrimaryLight: mix(
    white,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioBase
  ),
  colorPrimaryLighter: mix(
    white,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioMore
  ),
  colorPrimaryLightest: mix(
    white,
    basePalette.colorPrimary,
    shadingFactors.colorVariationRatioMost
  ),

  colorSecondaryDarkest: mix(
    black,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioMost
  ),
  colorSecondaryDarker: mix(
    black,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioMore
  ),
  colorSecondaryDark: mix(
    black,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioBase
  ),
  colorSecondaryDarky: mix(
    black,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioLess
  ),
  colorSecondaryLighty: mix(
    white,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioLess
  ),
  colorSecondaryLight: mix(
    white,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioBase
  ),
  colorSecondaryLighter: mix(
    white,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioMore
  ),
  colorSecondaryLightest: mix(
    white,
    basePalette.colorSecondary,
    shadingFactors.colorVariationRatioMost
  ),

  colorAccentDarkest: mix(
    black,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioMost
  ),
  colorAccentDarker: mix(
    black,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioMore
  ),
  colorAccentDark: mix(
    black,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioBase
  ),
  colorAccentDarky: mix(
    black,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioLess
  ),
  colorAccentLighty: mix(
    white,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioLess
  ),
  colorAccentLight: mix(
    white,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioBase
  ),
  colorAccentLighter: mix(
    white,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioMore
  ),
  colorAccentLightest: mix(
    white,
    basePalette.colorAccent,
    shadingFactors.colorVariationRatioMost
  ),

  colorGrayDarkest: mix(
    black,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioMost
  ),
  colorGrayDarker: mix(
    black,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioMore
  ),
  colorGrayDark: mix(
    black,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioBase
  ),
  colorGrayDarky: mix(
    black,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioLess
  ),
  colorGrayLighty: mix(
    white,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioLess
  ),
  colorGrayLight: mix(
    white,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioBase
  ),
  colorGrayLighter: mix(
    white,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioMore
  ),
  colorGrayLightest: mix(
    white,
    basePalette.colorGray,
    shadingFactors.colorVariationRatioMost
  ),

  colorWarningDarkest: mix(
    black,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioMost
  ),
  colorWarningDarker: mix(
    black,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioMore
  ),
  colorWarningDark: mix(
    black,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioBase
  ),
  colorWarningDarky: mix(
    black,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioLess
  ),
  colorWarningLighty: mix(
    white,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioLess
  ),
  colorWarningLight: mix(
    white,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioBase
  ),
  colorWarningLighter: mix(
    white,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioMore
  ),
  colorWarningLightest: mix(
    white,
    basePalette.colorWarning,
    shadingFactors.colorVariationRatioMost
  ),
};

// Unversal colors are defined with MUI DEFAULT theme
