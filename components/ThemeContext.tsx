import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    inactive: string;
  };
}

const lightColors = {
  background: "#FFFFFF",
  card: "#F5F5F7",
  text: "#1A1A1A",
  border: "#E0E0E0",
  primary: "#FF385C",
  secondary: "#5856D6",
  accent: "#34C759",
  error: "#FF3B30",
  inactive: "#8E8E93",
};

const darkColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#F5F5F7",
  border: "#2C2C2E",
  primary: "#FF385C",
  secondary: "#5E5CE6",
  accent: "#30D158",
  error: "#FF453A",
  inactive: "#636366",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(
    (systemColorScheme as ThemeType) || "light"
  );

  // Update theme when system theme changes
  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme as ThemeType);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
