/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#049CE4";
const tintColorDark = "#049CE4";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    backgroundCard: "white",
    backgroundCardTransparent: "rgba(128, 128, 128, 0.3)",
    backgroundHeader: "white",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    backgroundCard: "rgba(51, 51, 51, 1)",
    backgroundCardTransparent: "rgba(128, 128, 128, 0.3)",
    backgroundHeader: "rgba(51, 51, 51, 1)",
  },
};
