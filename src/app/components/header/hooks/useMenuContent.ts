import { useTheme } from "next-themes";

export const useMenuContent = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getThemeIcon = () => {
    return theme === "dark" ? "sun" : "moon";
  };

  return {
    theme,
    toggleTheme,
    getThemeIcon,
  };
};
