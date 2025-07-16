import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useRef, useCallback, useMemo } from "react";

import {
  type UseVirtualizedContentProps,
  type VirtualizedContentHookReturn,
} from "@/app/components/ui";

export const useVirtualizedContent = <T>({
  data,
  height = "100%",
  estimateSize = 50,
  overscan = 5,
  getItemKey,
  horizontal = false,
  enabled = true,
  debug = false,
  enableDynamicMeasurement = false,
  measureElement,
  onChange,
}: UseVirtualizedContentProps<T>): VirtualizedContentHookReturn => {
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

  const containerStyle = useMemo(
    () => ({
      height,
      width: horizontal ? "100%" : undefined,
      overflow: "auto" as const,
    }),
    [height, horizontal]
  );

  const totalSize = rowVirtualizer.getTotalSize();
  const safeSize = useMemo(() => {
    return totalSize > 0 && totalSize < Number.MAX_SAFE_INTEGER
      ? totalSize
      : data.length * (typeof estimateSize === "number" ? estimateSize : 50);
  }, [totalSize, data.length, estimateSize]);

  const innerStyle = useMemo(
    () => ({
      width: horizontal ? `${safeSize}px` : "100%",
      height: horizontal ? "100%" : `${safeSize}px`,
      position: "relative" as const,
    }),
    [horizontal, safeSize]
  );

  const virtualItems = rowVirtualizer.getVirtualItems();

  const getItemStyle = useCallback(
    (virtualItem: VirtualItem) => ({
      position: "absolute" as const,
      top: horizontal ? 0 : `${virtualItem.start}px`,
      left: horizontal ? `${virtualItem.start}px` : 0,
      width: horizontal ? `${virtualItem.size}px` : "100%",
      height: horizontal ? "100%" : `${virtualItem.size}px`,
    }),
    [horizontal]
  );

  return {
    parentRef,
    containerStyle,
    innerStyle,
    virtualItems,
    rowVirtualizer,
    getItemStyle,
    enableDynamicMeasurement,
    data,
  };
};
