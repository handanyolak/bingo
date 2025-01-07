import { useEffect, useMemo, useState } from "react";
import { keccak256 } from "viem";

const useCardColors = (
  address: string | null | undefined
): { colors: string[]; isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(true);

  const colors = useMemo(() => {
    if (!address) return [];

    const cleanAddress = address.slice(2);
    const addressBuffer = Buffer.from(cleanAddress, "hex");
    const hash = keccak256(addressBuffer);
    const hexSegment = hash.slice(0, 30);
    const newColors: string[] = [];

    for (let i = 0; i < 10; i++) {
      const segment = hexSegment.slice(i * 3, i * 3 + 3);
      if (segment.length < 3) break;

      const r = parseInt(segment[0], 16) * 10 + 50;
      const g = parseInt(segment[1], 16) * 10 + 50;
      const b = parseInt(segment[2], 16) * 10 + 50;

      newColors.push(`rgb(${r}, ${g}, ${b})`);
    }

    return newColors;
  }, [address]);

  useEffect(() => {
    if (!address) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [address]);

  return { colors, isLoading };
};

export default useCardColors;
