import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { ReactNode } from "react";

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

export interface LoaderProps {
  role?: string;
  "aria-label"?: string;
}

export interface VirtualizedContentProps<T> {
  data: readonly T[];
  height?: string | number;
  estimateSize?: number | ((index: number) => number);
  overscan?: number;
  renderItem: (item: T, index: number, virtualItem: VirtualItem) => ReactNode;
  getItemKey?: (index: number) => string | number;
  className?: string;
  horizontal?: boolean;
  enabled?: boolean;
  debug?: boolean;
  enableDynamicMeasurement?: boolean;
  measureElement?: (
    element: HTMLElement | null,
    entry: ResizeObserverEntry | undefined,
    instance: Virtualizer<HTMLDivElement, HTMLElement>
  ) => number;
  onChange?: (
    instance: Virtualizer<HTMLDivElement, HTMLElement>,
    sync: boolean
  ) => void;
}

export interface UseVirtualizedContentProps<T> {
  data: readonly T[];
  height?: string | number;
  estimateSize?: number | ((index: number) => number);
  overscan?: number;
  getItemKey?: (index: number) => string | number;
  horizontal?: boolean;
  enabled?: boolean;
  debug?: boolean;
  enableDynamicMeasurement?: boolean;
  measureElement?: (
    element: HTMLElement | null,
    entry: ResizeObserverEntry | undefined,
    instance: Virtualizer<HTMLDivElement, HTMLElement>
  ) => number;
  onChange?: (
    instance: Virtualizer<HTMLDivElement, HTMLElement>,
    sync: boolean
  ) => void;
}

export interface VirtualizedContentHookReturn<T = unknown> {
  parentRef: React.RefObject<HTMLDivElement | null>;
  containerStyle: React.CSSProperties;
  innerStyle: React.CSSProperties;
  virtualItems: VirtualItem[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  getItemStyle: (virtualItem: VirtualItem) => React.CSSProperties;
  enableDynamicMeasurement: boolean;
  data: readonly T[];
}
