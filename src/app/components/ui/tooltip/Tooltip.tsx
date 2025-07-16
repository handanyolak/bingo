"use client";

import React from "react";

import { type TooltipProps, useTooltip } from "@/app/components/ui";
import styles from "@/app/components/ui/tooltip/Tooltip.module.scss";

export const Tooltip = ({
  texts,
  position = "top",
  children,
}: TooltipProps) => {
  const { shouldRenderTooltip, tooltipClasses, mouseHandlers } = useTooltip({
    texts,
    position,
  });

  if (!shouldRenderTooltip) {
    return <>{children}</>;
  }

  return (
    <div className={tooltipClasses} {...mouseHandlers}>
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
