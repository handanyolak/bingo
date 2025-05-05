"use client";

import {
  useVirtualizer,
  type VirtualItem,
  type Virtualizer,
} from "@tanstack/react-virtual";
import { ReactNode, useRef, useCallback } from "react";

interface VirtualizedContentProps<T> {
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

export const VirtualizedContent = <T,>({
  data,
  height = "100%",
  estimateSize = 50,
  overscan = 5,
  renderItem,
  getItemKey,
  className = "",
  horizontal = false,
  enabled = true,
  debug = false,
  enableDynamicMeasurement = false,
  measureElement,
  onChange,
}: VirtualizedContentProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const getItemKeyCallback = useCallback(
    (index: number) => {
      return getItemKey ? getItemKey(index) : index;
    },
    [getItemKey]
  );

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize:
      typeof estimateSize === "function"
        ? estimateSize
        : () => estimateSize as number,
    overscan,
    getItemKey: getItemKeyCallback,
    horizontal,
    enabled,
    debug,
    measureElement: enableDynamicMeasurement ? measureElement : undefined,
    onChange,
  });

  const containerStyle = {
    height,
    width: horizontal ? "100%" : undefined,
    overflow: "auto",
  };

  const totalSize = rowVirtualizer.getTotalSize();
  const safeSize =
    totalSize > 0 && totalSize < Number.MAX_SAFE_INTEGER
      ? totalSize
      : data.length * (typeof estimateSize === "number" ? estimateSize : 50);

  const innerStyle = {
    width: horizontal ? `${safeSize}px` : "100%",
    height: horizontal ? "100%" : `${safeSize}px`,
    position: "relative" as const,
  };

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={className} style={containerStyle}>
      <div style={innerStyle}>
        {virtualItems.map((virtualItem) => {
          const item = data[virtualItem.index];

          if (item === undefined) return null;

          const itemStyle = {
            position: "absolute" as const,
            top: horizontal ? 0 : `${virtualItem.start}px`,
            left: horizontal ? `${virtualItem.start}px` : 0,
            width: horizontal ? `${virtualItem.size}px` : "100%",
            height: horizontal ? "100%" : `${virtualItem.size}px`,
          };

          if (enableDynamicMeasurement) {
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={itemStyle}
              >
                {renderItem(item, virtualItem.index, virtualItem)}
              </div>
            );
          }

          return (
            <div key={virtualItem.key} style={itemStyle}>
              {renderItem(item, virtualItem.index, virtualItem)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
