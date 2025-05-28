export type Address = `0x${string}`;

export interface WinnersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
  customRender?: (
    addresses: readonly Address[],
    renderWinner: (address: Address, index: number) => React.ReactNode
  ) => React.ReactNode;
  enableDynamicMeasurement?: boolean;
  debug?: boolean;
  horizontal?: boolean;
}

export interface PlayersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
  customRender?: (addresses: readonly Address[]) => React.ReactNode;
  enableDynamicMeasurement?: boolean;
  debug?: boolean;
  horizontal?: boolean;
}
