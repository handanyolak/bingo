import { useState, useMemo } from "react";

import { type UseTooltipProps } from "@/app/components/ui";
import styles from "@/app/components/ui/tooltip/Tooltip.module.scss";

export const useTooltip = ({ texts, position = "top" }: UseTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const shouldRenderTooltip = useMemo(() => {
    return texts && texts.length > 0;
  }, [texts]);

  const tooltipClasses = useMemo(() => {
    return `${styles.tooltip__wrapper} ${styles[`tooltip--${position}`]} ${
      isVisible ? styles["tooltip--visible"] : ""
    }`;
  }, [position, isVisible]);

  const mouseHandlers = useMemo(
    () => ({
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false),
    }),
    []
  );

  return {
    isVisible,
    shouldRenderTooltip,
    tooltipClasses,
    mouseHandlers,
  };
};
