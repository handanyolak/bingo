import { Menu, X } from "lucide-react";

import styles from "@/styles/MobileMenu.module.scss";
import type { MobileMenuProps } from "@/types";

export const MobileMenu = ({ isOpen, children, onToggle }: MobileMenuProps) => (
  <>
    <button className={styles.mobileMenu__toggle} onClick={onToggle}>
      {isOpen ? (
        <X size={24} className={styles.mobileMenu__icon} />
      ) : (
        <Menu size={24} className={styles.mobileMenu__icon} />
      )}
    </button>
    {isOpen && <div className={styles.mobileMenu__menu}>{children}</div>}
  </>
);
