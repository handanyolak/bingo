export const env = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  bingoContract: process.env.NEXT_BINGO_CONTRACT_ADDRESS as `0x${string}`,
} as const;
