/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF385C";
const tintColorDark = "#FF385C";

export const Colors = {
  light: {
    background: "#F8F9FA",
    cardBackground: "#FFFFFF",
    primary: "#4361EE",
    secondary: "#3A0CA3",
    text: "#212529",
    subtext: "#6C757D",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    backgroundCard: "white",
    backgroundCardTransparent: "rgba(128, 128, 128, 0.3)",
    backgroundHeader: "white",
  },
  dark: {
    background: "#121212",
    cardBackground: "#1E1E1E",
    primary: "#4361EE",
    secondary: "#BB86FC",
    text: "#FFFFFF",
    subtext: "#B0B0B0",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    backgroundCard: "rgba(51, 51, 51, 1)",
    backgroundCardTransparent: "rgba(128, 128, 128, 0.3)",
    backgroundHeader: "#121212",
  },
};
