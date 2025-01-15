"use client";

import styles from "@/styles/AppButton.module.scss";

interface AppButtonProps {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  content?: React.ReactNode;
  contentPosition?: "left" | "right";
  disabled?: boolean;
  onClick?: () => void;
}

export const AppButton = ({
  text,
  icon,
  iconPosition = "right",
  content,
  contentPosition = "right",
  disabled,
  onClick,
}: AppButtonProps) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.button__disabled : ""}`}
      onClick={onClick}
    >
      {contentPosition === "left" && content}
      {iconPosition === "left" && icon}
      {text}
      {iconPosition === "right" && icon}
      {contentPosition === "right" && content}
    </button>
  );
};
