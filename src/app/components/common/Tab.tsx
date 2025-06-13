"use client";

import React from "react";

import { useTab } from "@/app/hooks/useTab";
import styles from "@/styles/Tab.module.scss";
import type { TabItemProps, TabProps } from "@/types/tab";

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
