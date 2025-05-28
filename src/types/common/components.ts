export type RoundedSize = "full" | "lg" | "md" | "sm";

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
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export interface VirtualizedContentProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}
