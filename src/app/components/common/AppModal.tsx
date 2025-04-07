"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

import { useClickOutside } from "@/app/hooks/useClickOutside";
import styles from "@/styles/AppModal.module.scss";

interface AppModalProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AppModal = ({
  children,
  title,
  isOpen,
  onClose,
}: AppModalProps) => {
  const containerRef = useClickOutside<HTMLDivElement>(onClose);

  if (!isOpen) return null;

  return (
    <div className={styles.appModal}>
      <div ref={containerRef} className={styles.appModal__container}>
        {title && <h1 className={styles.appModal__title}>{title}</h1>}
        {children}
        <X
          onClick={onClose}
          className={styles.appModal__closeIcon}
          size={32}
          strokeWidth={2.75}
        />
      </div>
    </div>
  );
};
