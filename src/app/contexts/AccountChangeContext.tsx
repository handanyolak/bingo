"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";

interface AccountChangeContextType {
  key: string;
}

const AccountChangeContext = createContext<AccountChangeContextType>({
  key: "",
});

export const useAccountChange = () => useContext(AccountChangeContext);

export function AccountChangeProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { updateURL } = useSelectedAddress();
  const previousAddressRef = useRef<string | undefined>(address);

  useEffect(() => {
    if (address !== previousAddressRef.current) {
      toast.dismiss();

      if (address) {
        updateURL(address);
      }

      previousAddressRef.current = address;
    }
  }, [address, updateURL]);

  return (
    <AccountChangeContext.Provider value={{ key: address || "" }}>
      {children}
    </AccountChangeContext.Provider>
  );
}
