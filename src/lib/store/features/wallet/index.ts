export { useWallet } from "./hooks";

// Selector exports
export { selectWallet, selectAddress } from "./walletSelector";

// Slice exports
export { setAddress, type WalletState } from "./walletSlice";
export { default as walletReducer } from "./walletSlice";

// Re-export everything that needs to be public
export * from "./walletSlice";
