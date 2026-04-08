export type ExplorerNetwork =
  | 'Avalanche C-Chain'
  | 'Avalanche P-Chain'
  | 'Avalanche X-Chain'
  | 'Ethereum'
  | 'Bitcoin';

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

interface CryptoApisResponse {
  data: {
    item: {
      isConfirmed: boolean;
    };
  };
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
  const host =
    net === 'Mainnet'
      ? 'https://api.etherscan.io'
      : 'https://api-sepolia.etherscan.io';
  const url = new URL(`${host}/api`);
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
    { intervalMs: 20_000 },
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
  { intervalMs = POLL_INTERVAL_MS, maxAttempts = MAX_POLL_ATTEMPTS } = {},
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const data = await fetchFn();

    if (isConfirmed(data)) {
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

/** EVM chain ids for Glacier `/v1/chains/{chainId}/transactions/...` */
const GLACIER_AVALANCHE_C_CHAIN_ID: Record<NetEnv, string> = {
  Mainnet: '43114',
  Testnet: '43113',
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
  net: NetEnv,
  apiKey: string,
): Promise<GlacierTxPollState> {
  const chainId = GLACIER_AVALANCHE_C_CHAIN_ID[net];
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
  await pollUntilConfirmed(
    () => fetchGlacierUtxoTransaction(txID, blockchainId, net, apiKey),
    (state) => state.indexed === true,
  );
}

async function pollGlacierCChainEvmUntilIndexed(
  txHash: string,
  net: NetEnv,
): Promise<void> {
  const apiKey = requireGlacierApiKey();
  await pollUntilConfirmed(
    () => fetchGlacierEvmTransaction(txHash, net, apiKey),
    (state) => state.indexed === true,
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

/** C-Chain: Glacier EVM index + successful `eth_getTransactionReceipt` on RPC. */
async function verifyCChainViaGlacier(
  txHash: string,
  net: NetEnv,
): Promise<void> {
  await pollGlacierCChainEvmUntilIndexed(txHash, net);
  await verifyEvmTransactionViaRpc(txHash, 'Avalanche C-Chain', net);
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

  if (network === 'Avalanche C-Chain' && glacier) {
    await verifyCChainViaGlacier(txHash, net);
    return;
  }

  if (network === 'Ethereum' && etherscan) {
    await verifyEthereumViaEtherscan(txHash, net);
    return;
  }

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

  const response = await pollUntilConfirmed(
    () => getEthTransactionReceiptFromCluster(txHash, rpcUrls),
    (data) => data.result !== null,
  );

  if (!response.result) {
    throw new Error(`${network} tx receipt not found for ${txHash}`);
  }

  if (response.result.status !== '0x1') {
    throw new Error(
      `${network} tx reverted (status ${response.result.status}): ${JSON.stringify(response.result)}`,
    );
  }
}

/**
 * Verifies a transaction on Bitcoin via CryptoAPIs.
 * Bitcoin is not EVM-based, so we use the CryptoAPIs REST endpoint
 * and poll until item.isConfirmed is true.
 */
export async function verifyBitcoinTx(
  txHash: string,
  net: NetEnv = 'Testnet',
): Promise<CryptoApisResponse> {
  const { cryptoApis } = getApiKeys();
  const netPath = net === 'Mainnet' ? 'mainnet' : 'testnet';
  const url = `https://rest.cryptoapis.io/blockchain-data/bitcoin/${netPath}/transactions/${txHash}`;

  const result = await pollUntilConfirmed(
    () =>
      fetchJson<CryptoApisResponse>(url, {
        headers: { 'X-API-Key': cryptoApis },
      }),
    (data) => data.data?.item?.isConfirmed === true,
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
  if (network === 'Bitcoin') {
    await verifyBitcoinTx(txHash, net);
  } else if (network === 'Avalanche P-Chain') {
    await verifyPChainTransaction(txHash, net);
  } else if (network === 'Avalanche X-Chain') {
    await verifyXChainTransaction(txHash, net);
  } else {
    await verifyEvmTransaction(txHash, network, net);
  }
}
