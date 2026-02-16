const MEMPOOL_API = "https://mempool.space/api";

export async function getBtcBalance(address: string) {
  const res = await fetch(`${MEMPOOL_API}/address/${address}`);
  return res.json();
}

