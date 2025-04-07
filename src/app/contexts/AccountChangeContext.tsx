"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

interface AccountChangeContextType {
  key: string;
}

const AccountChangeContext = createContext<AccountChangeContextType>({
  key: "",
});

export const useAccountChange = () => useContext(AccountChangeContext);

export function AccountChangeProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  useEffect(() => {
    toast.dismiss();
  }, [address]);

  return (
    <AccountChangeContext.Provider value={{ key: address || "" }}>
      {children}
    </AccountChangeContext.Provider>
  );
}
