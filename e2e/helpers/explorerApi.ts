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
  };
}

/**
 * Extracts a transaction hash from a block explorer URL.
 * Supports URLs like https://testnet.snowtrace.io/tx/0x...
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

interface PlatformGetTxStatusResult {
  status: string;
}

/**
 * Verifies an EVM transaction via eth_getTransactionReceipt.
 * Works for any EVM chain (Avalanche C-Chain, Ethereum, etc.).
 *
 * Polls until the receipt is non-null, then checks:
 *   result.status === "0x1"  →  success
 *   result.status === "0x0"  →  reverted (throws)
 */
export async function verifyEvmTransaction(
  txHash: string,
  network: Exclude<
    ExplorerNetwork,
    'Bitcoin' | 'Avalanche P-Chain' | 'Avalanche X-Chain'
  >,
  net: NetEnv = 'Testnet',
): Promise<EvmTransactionReceipt> {
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

  return response.result;
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
 * Verifies a P-Chain transaction via AvalancheGo `platform.getTxStatus`
 * (cb58 txID, not an EVM 0x hash).
 */
export async function verifyPChainTransaction(
  txID: string,
  net: NetEnv = 'Testnet',
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

function isAvmOrPlatformTxDone(status: string | undefined): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === 'committed' || s === 'accepted';
}

/**
 * Verifies an X-Chain transaction via AvalancheGo `avm.getTxStatus`
 * (cb58 txID, not an EVM 0x hash).
 */
export async function verifyXChainTransaction(
  txID: string,
  net: NetEnv = 'Testnet',
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
 * Verifies a transaction on the specified network.
 *
 * - EVM chains (Avalanche C-Chain, Ethereum): eth_getTransactionReceipt via public RPCs
 *   (failover across providers where configured; see EVM_RPC)
 * - Avalanche P-Chain: platform.getTxStatus via public AvalancheGo API
 * - Avalanche X-Chain: avm.getTxStatus via public AvalancheGo API
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
