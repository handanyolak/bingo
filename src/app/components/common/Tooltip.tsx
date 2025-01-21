"use client";

import React, { useState, ReactNode } from "react";
import styles from "@/styles/Tooltip.module.scss";

type TooltipPosition = "top" | "bottom";

interface TooltipProps {
  texts: string[];
  position?: TooltipPosition;
  children: ReactNode;
}

export const Tooltip = ({
  texts,
  position = "top",
  children,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipClasses = `${styles.tooltip__wrapper} ${
    styles[`tooltip--${position}`]
  } ${isVisible && styles["tooltip--visible"]}`;

  return (
    <div
      className={tooltipClasses}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className={styles.tooltip__trigger}>{children}</div>
      <div className={styles.tooltip__content}>
        {texts.map((text, index) => (
          <div key={index} className={styles.tooltip__text}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};
