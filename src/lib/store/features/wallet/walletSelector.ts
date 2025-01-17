import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export const selectWallet = (state: RootState) => state.wallet;

export const selectAddress = createSelector(
  selectWallet,
  (wallet) => wallet.address
);
