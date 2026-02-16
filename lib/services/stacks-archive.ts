import { StacksMainnet } from "@stacks/network";

const ARCHIVE_URL = "https://stacks-node-api.mainnet.stacks.co";

export async function getBlock(height: number) {
  const res = await fetch(`${ARCHIVE_URL}/extended/v1/block/by_height/${height}`);
  return res.json();
}

