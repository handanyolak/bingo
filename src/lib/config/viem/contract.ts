import { getContract } from "viem";
import { abi } from "@/lib/config";
import { publicClient } from "@/lib/config";
import { env } from "@/config/env";

const contract = getContract({
  address: env.bingoContract,
  abi,
  client: publicClient,
});
