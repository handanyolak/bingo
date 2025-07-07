import React, { useState, Children, ReactElement } from "react";

import type { TabItemProps } from "@/types";

export const useTab = (
  children: ReactElement<TabItemProps> | ReactElement<TabItemProps>[],
  TabItemComponent: React.ComponentType<TabItemProps>,
  defaultTab: number = 0,
  onTabChange?: (index: number) => void
) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabItemProps> =>
      React.isValidElement(child) && child.type === TabItemComponent
  );

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return {
    activeTab,
    tabs,
    handleTabChange,
  };
};
