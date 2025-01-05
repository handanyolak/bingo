import { useMemo } from "react";
import { keccak256 } from "viem";

const useCardColors = (address: string | undefined): string[] => {
  const generateCardColors = useMemo(() => {
    if (!address) return [];

    const cleanAddress = address.slice(2);

    const addressBuffer = Buffer.from(cleanAddress, "hex");
    const hash = keccak256(addressBuffer);

    const hexSegment = hash.slice(0, 30);
    const colors: string[] = [];

    for (let i = 0; i < 10; i++) {
      const segment = hexSegment.slice(i * 3, i * 3 + 3);

      if (segment.length < 3) break;

      const r = parseInt(segment[0], 16) * 10 + 50;
      const g = parseInt(segment[1], 16) * 10 + 50;
      const b = parseInt(segment[2], 16) * 10 + 50;

      colors.push(`rgb(${r}, ${g}, ${b})`);
    }

    return colors;
  }, [address]);

  return generateCardColors;
};

export default useCardColors;
