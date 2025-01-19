import { configureStore } from "@reduxjs/toolkit";
import { walletReducer } from "@/lib/store/features/wallet";
import { bingoReducer } from "@/lib/store/features/bingo";

export const makeStore = () => {
  return configureStore({
    reducer: {
      wallet: walletReducer,
      bingo: bingoReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
