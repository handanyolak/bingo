"use client";

import { X } from "lucide-react";

import { useClickOutside } from "@/app/hooks/useClickOutside";
import styles from "@/styles/Modal.module.scss";
import type { ModalProps } from "@/types";

export const Modal = ({ children, title, isOpen, onClose }: ModalProps) => {
  const containerRef = useClickOutside<HTMLDivElement>(onClose);

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div ref={containerRef} className={styles.modal__container}>
        {title && <h1 className={styles.modal__title}>{title}</h1>}
        {children}
        <X
          onClick={onClose}
          className={styles.modal__closeIcon}
          size={32}
          strokeWidth={2.75}
        />
      </div>
    </div>
  );
};
