export type ExplorerNetwork =
  | 'Avalanche C-Chain'
  | 'Avalanche P-Chain'
  | 'Avalanche X-Chain'
  | 'Ethereum'
  | 'Beam L1'
  | 'Bitcoin'
  | 'Solana';

type NetEnv = 'Mainnet' | 'Testnet';

interface JsonRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result: T | null;
  error?: { code: number; message: string };
}

/**
 * eth_getTransactionReceipt response for any EVM chain.
 *
 * Key verification field:
 *   status  — "0x1" = success, "0x0" = reverted
 *
 * When result is null the tx hasn't been mined yet (we poll until non-null).
 */
interface EvmTransactionReceipt {
  status: string;
  transactionHash: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  to: string | null;
  gasUsed: string;
  cumulativeGasUsed: string;
  contractAddress: string | null;
  logs: unknown[];
}

const POLL_INTERVAL_MS = 5000;
/**
 * Override with E2E_TX_POLL_MAX_ATTEMPTS (positive integer) if needed.
 */
const MAX_POLL_ATTEMPTS = (() => {
  const fromEnv = process.env.E2E_TX_POLL_MAX_ATTEMPTS;
  if (fromEnv) {
    const n = Number.parseInt(fromEnv, 10);
    if (Number.isFinite(n) && n > 0) {
      return n;
    }
  }
  return 24;
})();

function getApiKeys() {
  return {
    cryptoApis: process.env.APITOKEN_CRYPTOAPIS ?? '',
    etherscan: process.env.APITOKEN_ETHERSCAN ?? '',
    /** AvaCloud Glacier Data API — header `x-glacier-api-key` */
    glacier: process.env.APITOKEN_GLACIER ?? process.env.GLACIER_API_KEY ?? '',
  };
}

function requireGlacierApiKey(): string {
  const k = getApiKeys().glacier;
  if (!k) {
    throw new Error(
      'APITOKEN_GLACIER (or GLACIER_API_KEY) is required for Glacier verification',
    );
  }
  return k;
}

/** Etherscan `gettxreceiptstatus` JSON. */
interface ExplorerTxReceiptStatusResponse {
  status?: string;
  message: string;
  result?: string | { status?: string } | null;
}

function getTxReceiptStatusFromExplorerResponse(
  data: ExplorerTxReceiptStatusResponse,
): 'pending' | 'success' | 'failed' {
  const msg = String(data.message ?? '');
  const result = data.result;

  if (msg === 'OK' && result && typeof result === 'object') {
    const s = String((result as { status?: string }).status ?? '');
    if (s === '1') {
      return 'success';
    }
    if (s === '0') {
      return 'failed';
    }
  }

  if (msg === 'OK' && result === '1') {
    return 'success';
  }
  if (msg === 'OK' && result === '0') {
    return 'failed';
  }

  return 'pending';
}

function buildEtherscanTxReceiptStatusUrl(
  txHash: string,
  net: NetEnv,
  apiKey: string,
): string {
  const chainId = net === 'Mainnet' ? '1' : '11155111';
  const url = new URL('https://api.etherscan.io/v2/api');
  url.searchParams.set('chainid', chainId);
  url.searchParams.set('module', 'transaction');
  url.searchParams.set('action', 'gettxreceiptstatus');
  url.searchParams.set('txhash', txHash);
  url.searchParams.set('apikey', apiKey);
  return url.toString();
}

async function verifyEthereumViaEtherscan(
  txHash: string,
  net: NetEnv,
): Promise<void> {
  const { etherscan } = getApiKeys();
  if (!etherscan) {
    throw new Error(
      'APITOKEN_ETHERSCAN is required for Ethereum explorer verification',
    );
  }

  const url = buildEtherscanTxReceiptStatusUrl(txHash, net, etherscan);
  console.log(
    `[explorer] Etherscan V2 gettxreceiptstatus  net=${net}  tx=${txHash}`,
  );

  const data = await pollUntilConfirmed(
    async () => {
      const res = await fetchJson<ExplorerTxReceiptStatusResponse>(url);
      const state = getTxReceiptStatusFromExplorerResponse(res);
      if (state === 'failed') {
        throw new Error(
          `Ethereum tx reverted or failed (Etherscan): ${JSON.stringify(res)}`,
        );
      }
      return res;
    },
    (res) => getTxReceiptStatusFromExplorerResponse(res) === 'success',
    { label: 'Etherscan' },
  );

  expectExplorerOkReceipt(data, 'Ethereum (Etherscan)');
}

function expectExplorerOkReceipt(
  data: ExplorerTxReceiptStatusResponse,
  label: string,
): void {
  if (data.message !== 'OK') {
    throw new Error(
      `${label}: expected message OK, got ${JSON.stringify(data)}`,
    );
  }
  if (getTxReceiptStatusFromExplorerResponse(data) !== 'success') {
    throw new Error(
      `${label}: expected success receipt status, got ${JSON.stringify(data)}`,
    );
  }
}

/**
 * Extracts a transaction hash from a block explorer URL (`0x` + 64 hex).
 */
export function extractTxHashFromUrl(url: string): string {
  const match = url.match(/(0x[a-fA-F0-9]{64})/);
  if (match) {
    return match[1]!;
  }
  throw new Error(`Could not extract transaction hash from URL: ${url}`);
}

async function fetchJson<T>(
  url: string,
  options?: {
    headers?: Record<string, string>;
    method?: string;
    body?: string;
  },
): Promise<T> {
  const response = await fetch(url, {
    method: options?.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: options?.body,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

async function pollUntilConfirmed<T>(
  fetchFn: () => Promise<T>,
  isConfirmed: (data: T) => boolean,
  {
    intervalMs = POLL_INTERVAL_MS,
    maxAttempts = MAX_POLL_ATTEMPTS,
    label = 'poll',
  } = {},
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const data = await fetchFn();
    const confirmed = isConfirmed(data);

    console.log(
      `[explorer] ${label} attempt ${attempt}/${maxAttempts} — ${confirmed ? 'CONFIRMED' : 'pending'} — ${JSON.stringify(data)}`,
    );

    if (confirmed) {
      return data;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  throw new Error(
    `Transaction not confirmed after ${maxAttempts} attempts (${(maxAttempts * intervalMs) / 1000}s)`,
  );
}

// ── EVM RPC endpoints ──────────────────────────────────────────────────
//
// Use multiple providers per network where practical. Avalanche docs note rate
// limits on public APIs; CI egress often shares datacenter IPs, so a single
// endpoint can return errors or never surface a receipt while another provider
// on the same chain does (same tx hash on Fuji / mainnet C-Chain).

const EVM_RPC: Partial<
  Record<
    Exclude<
      ExplorerNetwork,
      'Bitcoin' | 'Avalanche P-Chain' | 'Avalanche X-Chain'
    >,
    Record<NetEnv, readonly string[]>
  >
> = {
  'Avalanche C-Chain': {
    Mainnet: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche-c-chain-rpc.publicnode.com',
    ],
    Testnet: [
      'https://api.avax-test.network/ext/bc/C/rpc',
      'https://avalanche-fuji-c-chain-rpc.publicnode.com',
    ],
  },
  Ethereum: {
    Mainnet: ['https://ethereum-rpc.publicnode.com'],
    Testnet: ['https://ethereum-sepolia-rpc.publicnode.com'],
  },
  'Beam L1': {
    Mainnet: ['https://subnets.avax.network/beam/mainnet/rpc'],
    Testnet: [
      'https://build.onbeam.com/rpc/testnet',
      'https://subnets.avax.network/beam/testnet/rpc',
    ],
  },
};

async function getEthTransactionReceiptFromRpc(
  txHash: string,
  rpcUrl: string,
): Promise<JsonRpcResponse<EvmTransactionReceipt>> {
  return fetchJson<JsonRpcResponse<EvmTransactionReceipt>>(rpcUrl, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1,
    }),
  });
}

/**
 * Tries each RPC URL in order for one poll tick. Returns as soon as a node
 * returns a non-null receipt. If every node responds OK with a null receipt
 * (pending), returns the last such response. Throws if every URL fails (HTTP
 * or JSON-RPC error).
 */
async function getEthTransactionReceiptFromCluster(
  txHash: string,
  rpcUrls: readonly string[],
): Promise<JsonRpcResponse<EvmTransactionReceipt>> {
  const failures: string[] = [];
  let lastPending: JsonRpcResponse<EvmTransactionReceipt> | null = null;

  for (const rpcUrl of rpcUrls) {
    try {
      const data = await getEthTransactionReceiptFromRpc(txHash, rpcUrl);
      if (data.error) {
        failures.push(`${rpcUrl}: ${data.error.code} ${data.error.message}`);
        continue;
      }
      if (data.result !== null) {
        return data;
      }
      lastPending = data;
    } catch (e) {
      failures.push(`${rpcUrl}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (lastPending) {
    return lastPending;
  }

  throw new Error(
    `eth_getTransactionReceipt failed on all RPC endpoints:\n${failures.join('\n')}`,
  );
}

const P_CHAIN_RPC: Record<NetEnv, string> = {
  Mainnet: 'https://api.avax.network/ext/bc/P',
  Testnet: 'https://api.avax-test.network/ext/bc/P',
};

const X_CHAIN_RPC: Record<NetEnv, string> = {
  Mainnet: 'https://api.avax.network/ext/bc/X',
  Testnet: 'https://api.avax-test.network/ext/bc/X',
};

const GLACIER_API_BASE = 'https://glacier-api.avax.network';

/** EVM chain IDs for Glacier `/v1/chains/{chainId}/transactions/...` */
const GLACIER_EVM_CHAIN_ID: Record<string, Record<NetEnv, string>> = {
  'Avalanche C-Chain': { Mainnet: '43114', Testnet: '43113' },
  'Beam L1': { Mainnet: '4337', Testnet: '13337' },
};

function glacierNetworkSlug(net: NetEnv): string {
  return net === 'Mainnet' ? 'mainnet' : 'fuji';
}

type GlacierTxPollState = { indexed: true } | { indexed: false };

type GlacierUtxoBlockchainId = 'p-chain' | 'x-chain';

/**
 * Glacier Primary Network P- / X-Chain (cb58 tx id).
 * @see https://developers.avacloud.io/data-api/primary-network-transactions/get-transaction
 */
async function fetchGlacierUtxoTransaction(
  txID: string,
  blockchainId: GlacierUtxoBlockchainId,
  net: NetEnv,
  apiKey: string,
): Promise<GlacierTxPollState> {
  const network = glacierNetworkSlug(net);
  const url = `${GLACIER_API_BASE}/v1/networks/${network}/blockchains/${blockchainId}/transactions/${encodeURIComponent(txID)}`;

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'x-glacier-api-key': apiKey,
    },
  });

  if (response.status === 200) {
    await response.json().catch(() => undefined);
    return { indexed: true };
  }

  if (
    response.status === 404 ||
    response.status === 429 ||
    (response.status >= 500 && response.status < 600)
  ) {
    return { indexed: false };
  }

  const body = await response.text();
  throw new Error(
    `Glacier get transaction failed (${response.status}) for ${blockchainId} tx ${txID}: ${body}`,
  );
}

/**
 * Glacier EVM transaction (`0x` hash). Primary-network `.../c-chain/...` does not
 * accept full EVM hashes (length limit); use `/v1/chains/{chainId}/transactions/...`.
 * @see https://developers.avacloud.io/data-api/evm-transactions/get-transaction
 */
async function fetchGlacierEvmTransaction(
  txHash: string,
  chainId: string,
  apiKey: string,
): Promise<GlacierTxPollState> {
  const url = `${GLACIER_API_BASE}/v1/chains/${chainId}/transactions/${encodeURIComponent(txHash)}`;

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'x-glacier-api-key': apiKey,
    },
  });

  if (response.status === 200) {
    await response.json().catch(() => undefined);
    return { indexed: true };
  }

  if (
    response.status === 404 ||
    response.status === 429 ||
    (response.status >= 500 && response.status < 600)
  ) {
    return { indexed: false };
  }

  const body = await response.text();
  throw new Error(
    `Glacier EVM get transaction failed (${response.status}) chain ${chainId} tx ${txHash}: ${body}`,
  );
}

async function pollGlacierUtxoUntilIndexed(
  txID: string,
  blockchainId: GlacierUtxoBlockchainId,
  net: NetEnv,
): Promise<void> {
  const apiKey = requireGlacierApiKey();
  console.log(
    `[explorer] Glacier UTXO poll  chain=${blockchainId}  net=${net}  tx=${txID}`,
  );
  await pollUntilConfirmed(
    () => fetchGlacierUtxoTransaction(txID, blockchainId, net, apiKey),
    (state) => state.indexed === true,
    { label: `Glacier ${blockchainId}` },
  );
}

async function pollGlacierEvmUntilIndexed(
  txHash: string,
  network: string,
  net: NetEnv,
): Promise<void> {
  const apiKey = requireGlacierApiKey();
  const chainIds = GLACIER_EVM_CHAIN_ID[network];
  if (!chainIds) {
    throw new Error(`No Glacier EVM chain ID configured for ${network}`);
  }
  const chainId = chainIds[net];
  console.log(
    `[explorer] Glacier EVM poll  network=${network}  chainId=${chainId}  net=${net}  tx=${txHash}`,
  );
  await pollUntilConfirmed(
    () => fetchGlacierEvmTransaction(txHash, chainId, apiKey),
    (state) => state.indexed === true,
    { label: `Glacier ${network}` },
  );
}

/** P- or X-Chain: Glacier index + AvalancheGo finality. */
async function verifyUtxoChainViaGlacier(
  txID: string,
  blockchainId: 'p-chain' | 'x-chain',
  net: NetEnv,
): Promise<void> {
  await pollGlacierUtxoUntilIndexed(txID, blockchainId, net);
  if (blockchainId === 'p-chain') {
    await waitForPChainCommittedOnNode(txID, net);
  } else {
    await waitForXChainAcceptedOnNode(txID, net);
  }
}

/** Glacier EVM index + successful `eth_getTransactionReceipt` on RPC. */
async function verifyEvmViaGlacier(
  txHash: string,
  network: string,
  net: NetEnv,
): Promise<void> {
  await pollGlacierEvmUntilIndexed(txHash, network, net);
  await verifyEvmTransactionViaRpc(
    txHash,
    network as Exclude<
      ExplorerNetwork,
      'Bitcoin' | 'Avalanche P-Chain' | 'Avalanche X-Chain' | 'Solana'
    >,
    net,
  );
}

interface PlatformGetTxStatusResult {
  status: string;
}

function isAvmOrPlatformTxDone(status: string | undefined): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === 'committed' || s === 'accepted';
}

/** AvalancheGo: P-Chain tx is successfully finalized when status is `Committed`. */
async function waitForPChainCommittedOnNode(
  txID: string,
  net: NetEnv,
): Promise<void> {
  const rpcUrl = P_CHAIN_RPC[net];
  console.log(
    `[explorer] P-Chain node RPC platform.getTxStatus  net=${net}  tx=${txID}  rpc=${rpcUrl}`,
  );

  const response = await pollUntilConfirmed(
    () =>
      fetchJson<JsonRpcResponse<PlatformGetTxStatusResult>>(rpcUrl, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'platform.getTxStatus',
          params: { txID },
          id: 1,
        }),
      }),
    (data) => data.result?.status === 'Committed',
    { label: 'P-Chain node' },
  );

  console.log(
    `[explorer] P-Chain final status=${response.result?.status}  tx=${txID}`,
  );

  if (response.result?.status !== 'Committed') {
    throw new Error(
      `Avalanche P-Chain tx not committed for ${txID}: ${JSON.stringify(response.result)}`,
    );
  }
}

/** AvalancheGo: X-Chain export/import style finality is `Accepted` or `Committed`. */
async function waitForXChainAcceptedOnNode(
  txID: string,
  net: NetEnv,
): Promise<void> {
  const rpcUrl = X_CHAIN_RPC[net];
  console.log(
    `[explorer] X-Chain node RPC avm.getTxStatus  net=${net}  tx=${txID}  rpc=${rpcUrl}`,
  );

  const response = await pollUntilConfirmed(
    () =>
      fetchJson<JsonRpcResponse<PlatformGetTxStatusResult>>(rpcUrl, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'avm.getTxStatus',
          params: { txID },
          id: 1,
        }),
      }),
    (data) => isAvmOrPlatformTxDone(data.result?.status),
    { label: 'X-Chain node' },
  );

  console.log(
    `[explorer] X-Chain final status=${response.result?.status}  tx=${txID}`,
  );

  if (!isAvmOrPlatformTxDone(response.result?.status)) {
    throw new Error(
      `Avalanche X-Chain tx not accepted for ${txID}: ${JSON.stringify(response.result)}`,
    );
  }
}

/**
 * Verifies an EVM transaction.
 *
 * - Avalanche C-Chain: Glacier + RPC receipt when glacier key is set; else RPC only.
 * - Ethereum: Etherscan when `APITOKEN_ETHERSCAN` is set; else RPC.
 */
export async function verifyEvmTransaction(
  txHash: string,
  network: Exclude<
    ExplorerNetwork,
    'Bitcoin' | 'Avalanche P-Chain' | 'Avalanche X-Chain'
  >,
  net: NetEnv = 'Testnet',
): Promise<void> {
  const { etherscan, glacier } = getApiKeys();

  if (glacier && GLACIER_EVM_CHAIN_ID[network]) {
    console.log(`[explorer] Using Glacier + RPC path for ${network}`);
    await verifyEvmViaGlacier(txHash, network, net);
    return;
  }

  if (network === 'Ethereum' && etherscan) {
    console.log(`[explorer] Using Etherscan V2 API path for ${network}`);
    await verifyEthereumViaEtherscan(txHash, net);
    return;
  }

  console.log(`[explorer] Using direct RPC path for ${network}`);
  await verifyEvmTransactionViaRpc(txHash, network, net);
}

async function verifyEvmTransactionViaRpc(
  txHash: string,
  network: Exclude<
    ExplorerNetwork,
    'Bitcoin' | 'Avalanche P-Chain' | 'Avalanche X-Chain'
  >,
  net: NetEnv,
): Promise<void> {
  const rpcUrlsByNet = EVM_RPC[network];

  if (!rpcUrlsByNet) {
    throw new Error(
      `${network} is not an EVM chain — cannot use eth_getTransactionReceipt`,
    );
  }

  const rpcUrls = rpcUrlsByNet[net];
  console.log(
    `[explorer] EVM RPC eth_getTransactionReceipt  network=${network}  net=${net}  endpoints=${rpcUrls.join(', ')}`,
  );

  const response = await pollUntilConfirmed(
    () => getEthTransactionReceiptFromCluster(txHash, rpcUrls),
    (data) => data.result !== null,
    { label: `${network} RPC` },
  );

  if (!response.result) {
    throw new Error(`${network} tx receipt not found for ${txHash}`);
  }

  console.log(
    `[explorer] EVM RPC receipt  status=${response.result.status}  blockNumber=${response.result.blockNumber}  gasUsed=${response.result.gasUsed}`,
  );

  if (response.result.status !== '0x1') {
    throw new Error(
      `${network} tx reverted (status ${response.result.status}): ${JSON.stringify(response.result)}`,
    );
  }
}

interface MempoolSpaceTxResponse {
  txid: string;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  fee: number;
}

/**
 * Verifies a Bitcoin transaction exists on the network via mempool.space.
 *
 * Bitcoin testnet blocks take ~10 min, so we only verify the tx was
 * broadcast (exists in the mempool or is already confirmed) rather than
 * waiting for full block confirmation.
 */
export async function verifyBitcoinTx(
  txHash: string,
  net: NetEnv = 'Testnet',
): Promise<MempoolSpaceTxResponse> {
  const base =
    net === 'Mainnet'
      ? 'https://mempool.space/api'
      : 'https://mempool.space/testnet4/api';
  const url = `${base}/tx/${txHash}`;
  console.log(`[explorer] mempool.space Bitcoin  net=${net}  tx=${txHash}`);

  const result = await pollUntilConfirmed(
    async () => {
      const response = await fetch(url);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(
          `mempool.space request failed: ${response.status} ${response.statusText}`,
        );
      }
      return response.json() as Promise<MempoolSpaceTxResponse>;
    },
    (data) => data !== null,
    { label: 'Bitcoin mempool.space' },
  );

  if (!result) {
    throw new Error(`Bitcoin tx not found after polling: ${txHash}`);
  }

  const status = result.status.confirmed ? 'confirmed' : 'in mempool';
  console.log(
    `[explorer] Bitcoin tx found (${status})  fee=${result.fee} sats  tx=${txHash}`,
  );

  return result;
}

// ── Solana ────────────────────────────────────────────────────────────

const SOLANA_RPC: Record<NetEnv, string> = {
  Mainnet: 'https://api.mainnet-beta.solana.com',
  Testnet: 'https://api.devnet.solana.com',
};

interface SolanaSignatureStatus {
  slot: number;
  confirmations: number | null;
  err: unknown;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized';
}

interface SolanaSignatureStatusesResponse {
  jsonrpc: string;
  id: number;
  result: {
    context: { slot: number };
    value: Array<SolanaSignatureStatus | null>;
  };
}

/**
 * Verifies a Solana transaction via `getSignatureStatuses` JSON-RPC.
 *
 * Solana Devnet confirms in < 1 s, so a short poll window suffices.
 * We check for any non-null status (processed / confirmed / finalized)
 * and assert no execution error.
 */
export async function verifySolanaTransaction(
  signature: string,
  net: NetEnv = 'Testnet',
): Promise<SolanaSignatureStatus> {
  const rpcUrl = SOLANA_RPC[net];
  console.log(
    `[explorer] Solana RPC getSignatureStatuses  net=${net}  sig=${signature}  rpc=${rpcUrl}`,
  );

  const result = await pollUntilConfirmed(
    async () => {
      const res = await fetchJson<SolanaSignatureStatusesResponse>(rpcUrl, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSignatureStatuses',
          params: [[signature], { searchTransactionHistory: true }],
        }),
      });
      return res.result.value[0];
    },
    (status) => status !== null,
    { label: 'Solana RPC' },
  );

  if (!result) {
    throw new Error(`Solana tx not found after polling: ${signature}`);
  }

  if (result.err) {
    throw new Error(
      `Solana tx failed: ${JSON.stringify(result.err)}  sig=${signature}`,
    );
  }

  console.log(
    `[explorer] Solana tx confirmed  status=${result.confirmationStatus}  slot=${result.slot}  sig=${signature}`,
  );

  return result;
}

/**
 * Verifies a P-Chain transaction (cb58 txID, not an EVM 0x hash).
 *
 * With `APITOKEN_GLACIER` / `GLACIER_API_KEY`: poll Glacier until the tx is
 * indexed, then assert `Committed` via `platform.getTxStatus` on the node.
 * Without Glacier: only the node RPC poll (same final assertion).
 */
export async function verifyPChainTransaction(
  txID: string,
  net: NetEnv = 'Testnet',
): Promise<void> {
  const { glacier } = getApiKeys();
  if (glacier) {
    await verifyUtxoChainViaGlacier(txID, 'p-chain', net);
    return;
  }

  await waitForPChainCommittedOnNode(txID, net);
}

/**
 * Verifies an X-Chain transaction (cb58 txID, not an EVM 0x hash).
 *
 * With Glacier key: poll indexer until 200, then assert `Accepted` / `Committed`
 * via `avm.getTxStatus`. Without Glacier: node RPC only.
 */
export async function verifyXChainTransaction(
  txID: string,
  net: NetEnv = 'Testnet',
): Promise<void> {
  const { glacier } = getApiKeys();
  if (glacier) {
    await verifyUtxoChainViaGlacier(txID, 'x-chain', net);
    return;
  }

  await waitForXChainAcceptedOnNode(txID, net);
}

/**
 * Verifies a transaction on the specified network.
 *
 * - Avalanche C-Chain: Glacier + receipt RPC when glacier key set; else public RPCs
 * - Ethereum: Etherscan when APITOKEN_ETHERSCAN; else public RPCs
 * - Avalanche P-Chain / X-Chain: when APITOKEN_GLACIER (or GLACIER_API_KEY) is
 *   set, Glacier poll until indexed then node getTxStatus; otherwise node RPC only
 * - Bitcoin: CryptoAPIs REST endpoint
 *   → Requires APITOKEN_CRYPTOAPIS env var
 */
export async function verifyTransactionOnExplorer(
  txHash: string,
  network: ExplorerNetwork,
  net: NetEnv = 'Testnet',
): Promise<void> {
  console.log(
    `[explorer] ▶ verifyTransactionOnExplorer  network=${network}  net=${net}  tx=${txHash}`,
  );
  const t0 = Date.now();

  if (network === 'Bitcoin') {
    await verifyBitcoinTx(txHash, net);
  } else if (network === 'Solana') {
    await verifySolanaTransaction(txHash, net);
  } else if (network === 'Avalanche P-Chain') {
    await verifyPChainTransaction(txHash, net);
  } else if (network === 'Avalanche X-Chain') {
    await verifyXChainTransaction(txHash, net);
  } else {
    await verifyEvmTransaction(txHash, network, net);
  }

  console.log(
    `[explorer] ✔ verifyTransactionOnExplorer  network=${network}  tx=${txHash}  done in ${Date.now() - t0}ms`,
  );
}
