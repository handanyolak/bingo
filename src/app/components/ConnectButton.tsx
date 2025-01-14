"use client";

export const ConnectButton = () => {
  return (
    <div>
      {/* @ts-expect-error appkit issue */}
      <appkit-button />
    </div>
  );
};
