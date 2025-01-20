"use client";

import styles from "@/styles/AppButton.module.scss";

interface AppButtonProps {
  text: string;
  content?: React.ReactNode;
  contentPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppButton = ({
  text,
  content,
  contentPosition = "right",
  disabled = false,
  className = "",
  onClick,
}: AppButtonProps) => {
  const buttonClass = `${styles.button} ${
    disabled ? styles.button__disabled : ""
  } ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {contentPosition === "left" && content}
      {text}
      {contentPosition === "right" && content}
    </button>
  );
};
