import { memo, useMemo } from "react";

import {
  ThemeContext,
  useThemeLogic,
  type ThemeProviderProps,
} from "@/contexts";

export const ThemeProvider = memo(({ children }: ThemeProviderProps) => {
  const {
    mounted,
    currentColor,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  } = useThemeLogic();

  const contextValue = useMemo(
    () => ({ color: currentColor, lightColor, darkColor, cycleColor }),
    [currentColor, lightColor, darkColor, cycleColor]
  );

  if (!mounted) {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div className="theme-provider-loading" style={{ opacity: 0 }}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="theme-container" style={containerStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = "ThemeProvider";
