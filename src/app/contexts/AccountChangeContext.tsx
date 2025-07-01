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
import { useAppDispatch } from "@/lib/store/hooks";
import { resetStateForNewGame } from "@/lib/store/bingo";
import { useQueryClient } from "@tanstack/react-query";

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
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const previousAddressRef = useRef<string | undefined>(address);

  useEffect(() => {
    if (address !== previousAddressRef.current) {
      toast.dismiss();

      dispatch(resetStateForNewGame());

      queryClient.removeQueries({
        queryKey: ["contract"],
      });

      if (address) {
        updateURL(address);

        setTimeout(() => {
          queryClient.refetchQueries({
            queryKey: ["contract"],
          });
        }, 100);
      }

      previousAddressRef.current = address;
    }
  }, [address, updateURL, dispatch, queryClient]);

  return (
    <AccountChangeContext.Provider value={{ key: address || "" }}>
      {children}
    </AccountChangeContext.Provider>
  );
}
