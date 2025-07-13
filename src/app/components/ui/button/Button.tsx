"use client";

import type { ButtonProps } from "@/app/components/ui/button";
import styles from "@/app/components/ui/button/Button.module.scss";

export const Button = ({
  text,
  content,
  contentPosition = "right",
  disabled = false,
  className = "",
  rounded,
  animated = false,
  onClick,
}: ButtonProps) => {
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
