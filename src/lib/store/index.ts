import { configureStore } from "@reduxjs/toolkit";
import { walletReducer } from "@/lib/store/features/wallet";

export const makeStore = () => {
  return configureStore({
    reducer: {
      wallet: walletReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
