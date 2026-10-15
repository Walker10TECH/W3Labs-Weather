/**
 * Nokia Pure Headline — Font family constants.
 * Used across all text elements in the app.
 */
export const Fonts = {
  ultralight: 'NokiaPureHeadline-UltraLight',
  light: 'NokiaPureHeadline-Light',
  regular: 'NokiaPureHeadline-Regular',
  bold: 'NokiaPureHeadline-Bold',
};

/**
 * Centralized size scale.
 * All mobile-facing font sizes are reduced ~25% from the original design.
 * Desktop / tablet values are preserved.
 */
export const FontSizes = {
  // Hero temperature
  heroTempMobile: 63,      // was ~84
  heroTempSmall: 48,       // was ~64
  heroTempDesktop: 71,     // was ~94

  // City name
  cityNameMobile: 21,      // was 28
  cityNameSmall: 17,       // was 22
  cityNameDesktop: 24,     // was 32

  // Condition text
  conditionMobile: 15,     // was 20
  conditionSmall: 13,      // was 17

  // Widget card title (uppercase label)
  widgetTitle: 10,         // was 11

  // Widget primary value (big number)
  widgetValue: 26,         // was 34
  widgetValueMd: 18,       // was 24 (Wind, etc.)
  widgetValueSm: 21,       // was 28 (SunTime main time)

  // General body
  body: 12,                // was ~13
  bodySmall: 11,           // was 12-13
  bodySm: 10,              // was 11
  bodyXs: 9,               // was 10-11

  // Hourly
  hourlyTemp: 12,          // was 16
  hourHourLabel: 10,       // was 13

  // Daily
  dailyDay: 11,            // was 15
  dailyDaySmall: 10,       // was 13
  dailyTemp: 11,           // was 15
  dailyTempSmall: 10,      // was 13
  dailyPop: 8,             // was 10

  // Header
  headerUnit: 11,          // was 12

  // Min/Max pills
  minMaxPill: 11,          // was 12
  feelsLikeBadge: 11,      // was 12

  // Footer
  footerMain: 11,          // was 12
  footerSub: 10,           // was 11

  // Region text
  region: 12,              // was 13
};
