"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

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
