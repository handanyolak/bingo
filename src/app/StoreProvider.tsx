"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";
import type { Store } from "@reduxjs/toolkit";
import type { WalletState } from "@/lib/store/features/wallet/walletSlice";

interface RootState {
  wallet: WalletState;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<Store<RootState>>(makeStore());
  return <Provider store={storeRef.current}>{children}</Provider>;
}
