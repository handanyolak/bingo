"use client";

import styles from "@/styles/AppButton.module.scss";
import type { AppButtonProps } from "@/types/common";

export const AppButton = ({
  text,
  content,
  contentPosition = "right",
  disabled = false,
  className = "",
  rounded,
  animated = false,
  onClick,
}: AppButtonProps) => {
  const buttonClass = `${styles.button} ${
    disabled ? styles.buttonDisabled : ""
  } ${rounded ? styles[`rounded__${rounded}`] : ""} ${
    animated ? styles.buttonAnimated : ""
  } ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {contentPosition === "left" && content}
      {text}
      {contentPosition === "right" && content}
    </button>
  );
};
