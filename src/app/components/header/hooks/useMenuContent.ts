import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export const useMenuContent = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getThemeIcon = () => {
    if (!mounted) return "moon";
    return theme === "dark" ? "sun" : "moon";
  };

  return {
    theme,
    mounted,
    toggleTheme,
    getThemeIcon,
  };
};
