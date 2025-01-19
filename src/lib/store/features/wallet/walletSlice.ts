import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WalletState, SetAddressPayload } from "./types";

const initialState: WalletState = {
  address: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<SetAddressPayload>) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress } = walletSlice.actions;
export default walletSlice.reducer;
