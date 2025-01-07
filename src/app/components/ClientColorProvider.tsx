"use client";

import { useWallet } from "@/lib/features/wallet/hooks";
import useCardColors from "@/app/hooks/useCardColors";
import { Loader } from "@/app/components/Loader";
import { ColorProvider } from "@/app/contexts/ColorContext";

export function ClientColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address } = useWallet();
  const { colors, isLoading } = useCardColors(address || undefined);

  const DEFAULT_COLOR = "rgb(209, 213, 219)";

  const isValidColor = (color?: string): color is string =>
    typeof color === "string" && !color.includes("NaN");

  const color = isValidColor(colors?.[0]) ? colors[0] : DEFAULT_COLOR;

  if (isLoading) {
    return <Loader />;
  }

  return <ColorProvider color={color}>{children}</ColorProvider>;
}
