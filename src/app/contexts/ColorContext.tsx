import React, { createContext, useContext, ReactNode } from "react";
import { lighten, darken } from "polished";

type ColorContextType = {
  color: string;
  lightColor: string;
  darkColor: string;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

type ColorProviderProps = {
  color: string;
  children: ReactNode;
};

export const ColorProvider: React.FC<ColorProviderProps> = ({
  color,
  children,
}) => {
  const lightColor = lighten(0.1, color);
  const darkColor = darken(0.1, color);

  return (
    <ColorContext.Provider value={{ color, lightColor, darkColor }}>
      <div
        style={
          {
            "--card-color": color,
            "--card-light-color": lightColor,
            "--card-dark-color": darkColor,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ColorContext.Provider>
  );
};

export const useColor = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};
