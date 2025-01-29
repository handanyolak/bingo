import { useReadContract } from "wagmi";
import { abi } from "@/lib/wagmi/abis";
import { env } from "@/config/env";
import { sepolia } from "wagmi/chains";

export const useGameId = () => {
  const {
    data: gameId,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    address: env.bingoContract,
    abi: abi,
    functionName: "availableGameId",
    chainId: sepolia.id,
  });

  return {
    gameId: gameId?.toString(),
    isError,
    isLoading,
    refetch,
  };
};
