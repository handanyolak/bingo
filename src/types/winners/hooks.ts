import { Address } from "viem";
import { ContractReads } from "@/lib/web3";

export interface UseClaimRewardProps {
  address?: Address;
  contractData?: ContractReads;
  isWinner: boolean;
  claimReward: (gameId: bigint) => Promise<`0x${string}`>;
  isClaimRewardPending: boolean;
  isClaimRewardConfirming: boolean;
  isClaimRewardSuccess: boolean;
  showInitiatingTransactionToast: (id: string) => void;
  showSuccessToast: (id: string, message: string) => void;
  showErrorToast: (error: any) => void;
  dismissToast: (id: string) => void;
  rewardClaimedMessage: string;
}

export interface UseWinnersProps {
  contractData?: ContractReads;
  isGameFinishedInUi: boolean;
  isLoading: boolean;
}
