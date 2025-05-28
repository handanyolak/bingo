export interface MobileMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  onToggle: () => void;
}

export interface MenuContentProps {
  onModalOpen: () => void;
  onColorChange: () => void;
}
