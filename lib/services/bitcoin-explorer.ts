const MEMPOOL_API = "https://mempool.space/api";

export async function getBtcBalance(address: string) {
  const res = await fetch(`${MEMPOOL_API}/address/${address}`);
  return res.json();
}

export async function getUtxos(address: string) {
  const res = await fetch(`${MEMPOOL_API}/address/${address}/utxo`);
  return res.json();
}

