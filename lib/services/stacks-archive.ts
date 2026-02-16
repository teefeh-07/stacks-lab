import { StacksMainnet } from "@stacks/network";

const ARCHIVE_URL = "https://stacks-node-api.mainnet.stacks.co";

export async function getBlock(height: number) {
  const res = await fetch(`${ARCHIVE_URL}/extended/v1/block/by_height/${height}`);
  return res.json();
}

export async function getTransaction(txid: string) {
  const res = await fetch(`${ARCHIVE_URL}/extended/v1/tx/${txid}`);
  return res.json();
}

async function fetchWithRetry(url: string, retries = 3) {
  // Implementation
}

