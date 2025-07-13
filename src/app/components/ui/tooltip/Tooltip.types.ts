export type TooltipPosition = "top" | "bottom";

export interface TooltipProps {
  texts: string[];
  position?: TooltipPosition;
  children: React.ReactNode;
}

export interface UseTooltipProps {
  texts: string[];
  position?: TooltipPosition;
}
