import { Address } from "viem";

export interface AddressListProps {
  addresses: readonly Address[];
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
  isLoading: boolean;
  isVisible: boolean;
  emptyText: string;
  keyPrefix: string;
  estimateSize?: number;
  additionalContent?: React.ReactNode;
}
