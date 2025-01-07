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
  const color = colors[1] || "#fff";

  if (isLoading) {
    return <Loader />;
  }

  return <ColorProvider color={color}>{children}</ColorProvider>;
}
