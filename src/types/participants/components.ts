import { Address } from "viem";

export interface WinnersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
}

export interface PlayersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
}
