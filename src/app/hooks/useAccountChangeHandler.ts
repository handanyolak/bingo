import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { useSelectedAddress } from "@/app/hooks";
import { resetStateForNewGame } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";

export function useAccountChangeHandler() {
  const { address } = useAccount();
  const { updateURL } = useSelectedAddress();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const previousAddressRef = useRef<string | undefined>(address);

  useEffect(() => {
    if (address === previousAddressRef.current) return;

    const handleAccountChange = async () => {
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
    };

    handleAccountChange();
    previousAddressRef.current = address;
  }, [address, updateURL, dispatch, queryClient]);

  return { currentAddress: address };
}
