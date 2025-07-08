import { ContractReads } from "@/lib/web3";

export interface UseWinnersProps {
  contractData?: ContractReads;
  isGameFinishedInUi: boolean;
  isLoading: boolean;
}
