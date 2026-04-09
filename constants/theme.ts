/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const lightPalette = {
  primary: '#FF00FF',
  secondary: '#00E0E0',
  bg: '#F0F0F0',
  surface: '#F0F0F0',
  text: '#002040',
  icon: '#676767',
};

const darkPalette = {
  primary: '#B00B69',
  secondary: '#690BB0',
  bg: '#474951',
  surface: '#2b2b2b',
  text: '#F0F0F0',
  icon: '#696969',
};

export const Colors = {
  light: {
    primary: lightPalette.primary,
    secondary: lightPalette.secondary,
    bg: lightPalette.bg,
    surface: lightPalette.surface,
    text: lightPalette.text,

    // Compatibility keys used by the starter components.
    background: lightPalette.bg,
    tint: lightPalette.primary,
    icon: lightPalette.icon,
    tabIconDefault: lightPalette.icon,
    tabIconSelected: lightPalette.primary,
  },
  dark: {
    primary: darkPalette.primary,
    secondary: darkPalette.secondary,
    bg: darkPalette.bg,
    surface: darkPalette.surface,
    text: darkPalette.text,

    // Compatibility keys used by the starter components.
    background: darkPalette.bg,
    tint: darkPalette.primary,
    icon: darkPalette.icon,
    tabIconDefault: darkPalette.icon,
    tabIconSelected: darkPalette.primary,
  },
};

export const UiTokens = {
  transitionFast: '0.2s ease-in-out',
  transitionDefault: '0.4s ease-in-out',
  shadowDefault: '5px 5px 15px 5px rgba(0, 0, 0, 0.5)',
  radiusDefault: 20,
  radiusButton: 8,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
