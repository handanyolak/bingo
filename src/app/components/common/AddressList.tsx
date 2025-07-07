"use client";

import { Loader2 } from "lucide-react";
import { Address } from "viem";

import { VirtualizedContent } from "@/app/components/common/VirtualizedContent";
import styles from "@/styles/AddressList.module.scss";
import { AddressListProps } from "@/types";

// Default address item render function
const renderAddressItem = (
  address: Address,
  index: number,
  onAddressClick: (address: Address) => void,
  itemClassName: string
) => {
  if (!address) return null;

  return (
    <button
      type="button"
      className={itemClassName}
      onClick={() => onAddressClick(address)}
    >
      {index + 1}. {address}
    </button>
  );
};

export const AddressList = ({
  addresses,
  onAddressClick,
  renderMode = "virtualized",
  isLoading,
  isVisible,
  emptyText,
  keyPrefix,
  estimateSize = 50,
  additionalContent,
}: AddressListProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={styles.addressList__list}>
        <div className={styles.addressList__loading}>
          <Loader2 className="global-loader" />
        </div>
      </div>
    );
  }

  // Empty/not visible state
  if (!isVisible) {
    return (
      <div className={styles.addressList__list}>
        <div className={styles.addressList__empty}>{emptyText}</div>
      </div>
    );
  }

  // Address item render function
  const renderAddress = (address: Address, index: number) => {
    return renderAddressItem(
      address,
      index,
      onAddressClick,
      styles.addressList__item
    );
  };

  const mainContent = (() => {
    // Virtualized render mode
    if (renderMode === "virtualized") {
      return (
        <VirtualizedContent
          data={addresses}
          className={styles.addressList__list}
          estimateSize={estimateSize}
          overscan={20}
          renderItem={renderAddress}
          getItemKey={(index) => `${keyPrefix}-${addresses[index]}`}
          horizontal={false}
          debug={false}
          enableDynamicMeasurement={false}
        />
      );
    }

    // Default render mode
    return (
      <div className={styles.addressList__list}>
        {addresses.map((address, index) => (
          <button
            key={`${keyPrefix}-${address}-${index}`}
            type="button"
            className={styles.addressList__item}
            onClick={() => onAddressClick(address)}
          >
            {index + 1}. {address}
          </button>
        ))}
      </div>
    );
  })();

  // Return with optional additional content
  return (
    <>
      {additionalContent}
      {mainContent}
    </>
  );
};
