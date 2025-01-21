"use client";

import styles from "@/styles/AppButton.module.scss";

type RoundedSize = "full" | "lg" | "md" | "sm";

interface AppButtonProps {
  text: string;
  content?: React.ReactNode;
  contentPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  rounded?: RoundedSize;
  animated?: boolean;
  onClick?: () => void;
}

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
    disabled ? styles.button__disabled : ""
  } ${rounded ? styles[`rounded__${rounded}`] : ""} ${
    animated ? styles.button__animated : ""
  } ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {contentPosition === "left" && content}
      {text}
      {contentPosition === "right" && content}
    </button>
  );
};
