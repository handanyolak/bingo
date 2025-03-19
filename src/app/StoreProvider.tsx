"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<Store<RootState>>(makeStore());
  return <Provider store={storeRef.current}>{children}</Provider>;
}
