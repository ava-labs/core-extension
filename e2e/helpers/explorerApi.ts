export type ExplorerNetwork =
  | 'Avalanche C-Chain'
  | 'Avalanche P-Chain'
  | 'Ethereum'
  | 'Bitcoin';

type NetEnv = 'Mainnet' | 'Testnet';

interface JsonRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result: T | null;
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
const MAX_POLL_ATTEMPTS = 24; // 2 minutes max

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

const EVM_RPC: Partial<
  Record<
    Exclude<ExplorerNetwork, 'Bitcoin' | 'Avalanche P-Chain'>,
    Record<NetEnv, string>
  >
> = {
  'Avalanche C-Chain': {
    Mainnet: 'https://api.avax.network/ext/bc/C/rpc',
    Testnet: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  Ethereum: {
    Mainnet: 'https://ethereum-rpc.publicnode.com',
    Testnet: 'https://ethereum-sepolia-rpc.publicnode.com',
  },
};

const P_CHAIN_RPC: Record<NetEnv, string> = {
  Mainnet: 'https://api.avax.network/ext/bc/P',
  Testnet: 'https://api.avax-test.network/ext/bc/P',
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
  network: Exclude<ExplorerNetwork, 'Bitcoin' | 'Avalanche P-Chain'>,
  net: NetEnv = 'Testnet',
): Promise<EvmTransactionReceipt> {
  const rpcUrls = EVM_RPC[network];

  if (!rpcUrls) {
    throw new Error(
      `${network} is not an EVM chain — cannot use eth_getTransactionReceipt`,
    );
  }

  const rpcUrl = rpcUrls[net];

  const response = await pollUntilConfirmed(
    () =>
      fetchJson<JsonRpcResponse<EvmTransactionReceipt>>(rpcUrl, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1,
        }),
      }),
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

/**
 * Verifies a transaction on the specified network.
 *
 * - EVM chains (Avalanche C-Chain, Ethereum): eth_getTransactionReceipt via public RPC
 *   → No API key needed, instant confirmation once mined
 * - Avalanche P-Chain: platform.getTxStatus via public AvalancheGo API
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
  } else {
    await verifyEvmTransaction(txHash, network, net);
  }
}
