import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { ReactNode } from "react";

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
