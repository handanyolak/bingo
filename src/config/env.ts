export const env = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  bingoContractAddress: process.env
    .NEXT_PUBLIC_BINGO_CONTRACT_ADDRESS as `0x${string}`,
} as const;

if (!env.projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID must be defined");
}

if (!env.bingoContractAddress || !env.bingoContractAddress.startsWith("0x")) {
  throw new Error(
    "NEXT_PUBLIC_BINGO_CONTRACT_ADDRESS must be defined and start with 0x"
  );
}
