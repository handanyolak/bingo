"use client";

import {
  type VirtualizedContentProps,
  useVirtualizedContent,
} from "@/app/components/ui";

export const VirtualizedContent = <T,>({
  renderItem,
  className = "",
  ...hookProps
}: VirtualizedContentProps<T>) => {
  const {
    parentRef,
    containerStyle,
    innerStyle,
    virtualItems,
    rowVirtualizer,
    getItemStyle,
    enableDynamicMeasurement,
    data,
  } = useVirtualizedContent(hookProps);

  return (
    <div ref={parentRef} className={className} style={containerStyle}>
      <div style={innerStyle}>
        {virtualItems.map((virtualItem) => {
          const item = data[virtualItem.index] as T;

          if (item === undefined) return null;

          const itemStyle = getItemStyle(virtualItem);

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
