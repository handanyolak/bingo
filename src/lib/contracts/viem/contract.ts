import { getContract } from "viem";
import { abi } from "@/lib/contracts";
import { publicClient } from "@/lib/contracts";
import { env } from "@/config/env";

const contract = getContract({
  address: env.bingoContract,
  abi,
  client: publicClient,
});
