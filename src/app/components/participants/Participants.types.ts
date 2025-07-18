import { Address } from "viem";

import { ContractReads } from "@/lib/web3";

export interface WinnersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
}

export interface PlayersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
}

export interface UseWinnersProps {
  winners?: ContractReads["winners"];
  isGameFinishedInUi: boolean;
  isLoading: boolean;
}
