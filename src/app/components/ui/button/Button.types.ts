export type RoundedSize = "full" | "lg" | "md" | "sm";

export interface ButtonProps {
  text: string;
  content?: React.ReactNode;
  contentPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  rounded?: RoundedSize;
  animated?: boolean;
  onClick?: () => void;
}
