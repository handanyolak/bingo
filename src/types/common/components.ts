export type RoundedSize = "full" | "lg" | "md" | "sm";

export type TooltipPosition = "top" | "bottom";

export interface AppButtonProps {
  text: string;
  content?: React.ReactNode;
  contentPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  rounded?: RoundedSize;
  animated?: boolean;
  onClick?: () => void;
}

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export interface TooltipProps {
  texts: string[];
  position?: TooltipPosition;
  children: React.ReactNode;
}

export interface UseTooltipProps {
  texts: string[];
  position?: TooltipPosition;
}

export interface VirtualizedContentProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}
