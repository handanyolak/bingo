import React from "react";

export type TabItemProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export type TabProps = {
  children:
    | React.ReactElement<TabItemProps>
    | React.ReactElement<TabItemProps>[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
};
