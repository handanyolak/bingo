import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WalletState {
  address: string | null;
}

const initialState: WalletState = {
  address: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress } = walletSlice.actions;
export default walletSlice.reducer;
