"use client";

import styles from "@/styles/Tab.module.scss";
import React, { useState, Children, ReactElement } from "react";

type TabItemProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

type TabProps = {
  children: ReactElement<TabItemProps> | ReactElement<TabItemProps>[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
};

export const TabItem = ({ children }: TabItemProps) => {
  return <div className={styles.tab__content}>{children}</div>;
};

export const Tab = ({ children, defaultTab = 0, onTabChange }: TabProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabItemProps> =>
      React.isValidElement(child) && child.type === TabItem
  );

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <div className={styles.tab}>
      <div className={styles.tab__header}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab__button} ${
              activeTab === index ? styles.tab__button_active : ""
            }`}
            onClick={() => handleTabChange(index)}
          >
            <span className={styles.tab__button_content}>
              {tab.props.icon && (
                <span className={styles.tab__button_icon}>
                  {tab.props.icon}
                </span>
              )}
              <span className={styles.tab__button_title}>
                {tab.props.title}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.tab__panel}>{tabs[activeTab]}</div>
    </div>
  );
};

export type { TabProps, TabItemProps };
