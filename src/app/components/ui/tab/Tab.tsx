"use client";

import React from "react";

import type { TabItemProps, TabProps } from "@/app/components/ui/tab";
import { useTab } from "@/app/components/ui/tab";
import styles from "@/app/components/ui/tab/Tab.module.scss";

export const TabItem = ({ children }: TabItemProps) => {
  return <div className={styles.tab__content}>{children}</div>;
};

export const Tab = ({ children, defaultTab = 0, onTabChange }: TabProps) => {
  const { activeTab, tabs, handleTabChange } = useTab(
    children,
    TabItem,
    defaultTab,
    onTabChange
  );

  return (
    <div className={styles.tab}>
      <div className={styles.tab__header}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab__button} ${
              activeTab === index ? styles.tab__buttonActive : ""
            }`}
            onClick={() => handleTabChange(index)}
          >
            <span className={styles.tab__buttonContent}>
              {tab.props.icon && (
                <span className={styles.tab__buttonIcon}>{tab.props.icon}</span>
              )}
              <span className={styles.tab__buttonTitle}>{tab.props.title}</span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.tab__panel}>{tabs[activeTab]}</div>
    </div>
  );
};
