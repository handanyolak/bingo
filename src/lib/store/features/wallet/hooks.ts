import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
import { AppDispatch } from "@/lib/store";
import { setAddress } from "@/lib/store/features/wallet";
import { selectAddress } from "@/lib/store/features/wallet";

export const useWallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address: appKitAddress } = useAppKitAccount();
  const address = useSelector(selectAddress);

  useEffect(() => {
    dispatch(setAddress(appKitAddress || null));
  }, [appKitAddress, dispatch]);

  return { address };
};
