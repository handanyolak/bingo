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
  onClick?: () => void;
}

export const AppButton = ({
  text,
  content,
  contentPosition = "right",
  disabled = false,
  className = "",
  rounded,
  onClick,
}: AppButtonProps) => {
  const buttonClass = `${styles.button} ${
    disabled ? styles.button__disabled : ""
  } ${rounded ? styles[`rounded__${rounded}`] : ""} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {contentPosition === "left" && content}
      {text}
      {contentPosition === "right" && content}
    </button>
  );
};
