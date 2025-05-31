export interface BuyCardButtonProps {
  refetch: () => void;
}

export interface RequestRandomButtonProps {
  refetch: () => void;
}

export interface SubmitCardButtonProps {
  refetch: () => void;
  shouldShow: boolean;
}

export interface GameTimerProps {
  contractData: any;
}
