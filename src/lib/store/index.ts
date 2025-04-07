import { configureStore } from "@reduxjs/toolkit";

import { bingoReducer } from "@/lib/store/bingo";

export const makeStore = () => {
  return configureStore({
    reducer: {
      bingo: bingoReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
