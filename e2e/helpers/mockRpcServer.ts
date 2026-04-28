import * as http from 'node:http';

interface JsonRpcRequest {
  id: number | string;
  jsonrpc: string;
  method: string;
  params?: unknown[];
}

interface JsonRpcResponse {
  id: number | string;
  jsonrpc: '2.0';
  result?: unknown;
  error?: { code: number; message: string };
}

interface MockRpcState {
  blockNumber: number;
  nonce: number;
  pendingTxHashes: Set<string>;
}

const AVALANCHE_CHAIN_ID = '0xa86a';
const ETHEREUM_CHAIN_ID = '0x1';
const BASE_CHAIN_ID = '0x2105';
const DEFAULT_BALANCE = '0x56BC75E2D63100000'; // 100 ETH/AVAX
const DEFAULT_ERC20_BALANCE =
  '0x00000000000000000000000000000000000000000000d3c21bcecceda1000000';

function createRpcHandler(state: MockRpcState, chainId: string) {
  return (req: JsonRpcRequest): unknown => {
    switch (req.method) {
      case 'eth_chainId':
        return chainId;

      case 'net_version':
        return String(parseInt(chainId, 16));

      case 'eth_blockNumber':
        state.blockNumber++;
        return `0x${state.blockNumber.toString(16)}`;

      case 'eth_getBalance':
        return DEFAULT_BALANCE;

      case 'eth_getTransactionCount':
        return `0x${state.nonce.toString(16)}`;

      case 'eth_call': {
        const data = (req.params?.[0] as { data?: string })?.data ?? '';
        if (data.startsWith('0xdd62ed3e')) return '0x' + '00'.repeat(32); // allowance → 0
        if (data.startsWith('0x70a08231')) return DEFAULT_ERC20_BALANCE; // balanceOf
        if (data.startsWith('0x313ce567')) return '0x' + '12'.padStart(64, '0'); // decimals → 18
        if (data.startsWith('0x95d89b41'))
          return '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003544b4e0000000000000000000000000000000000000000000000000000000000';
        if (data.startsWith('0x095ea7b3')) return '0x' + '01'.padStart(64, '0'); // approve → true
        return '0x';
      }

      case 'eth_estimateGas':
        return '0x5208';

      case 'eth_gasPrice':
        return '0x5d21dba00';

      case 'eth_maxPriorityFeePerGas':
        return '0x3b9aca00';

      case 'eth_feeHistory':
        return {
          oldestBlock: `0x${state.blockNumber.toString(16)}`,
          baseFeePerGas: ['0x5d21dba00', '0x5d21dba00'],
          gasUsedRatio: [0.5],
          reward: [['0x3b9aca00']],
        };

      case 'eth_getCode':
        return '0x6080';

      case 'eth_getLogs':
        return [];

      case 'eth_getBlockByNumber':
        return {
          number: `0x${state.blockNumber.toString(16)}`,
          hash: `0x${'cd'.repeat(32)}`,
          parentHash: `0x${'ab'.repeat(32)}`,
          timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`,
          gasLimit: '0x1c9c380',
          gasUsed: '0x0',
          miner: `0x${'00'.repeat(20)}`,
          transactions: [],
          baseFeePerGas: '0x5d21dba00',
        };

      case 'eth_suggestPriceOptions':
        return {
          baseFee: '0x5d21dba00',
          low: {
            maxFeePerGas: '0x6fc23ac00',
            maxPriorityFeePerGas: '0x3b9aca00',
          },
          medium: {
            maxFeePerGas: '0x8bb2c9700',
            maxPriorityFeePerGas: '0x77359400',
          },
          high: {
            maxFeePerGas: '0xa7a35e200',
            maxPriorityFeePerGas: '0xb2d05e00',
          },
        };

      case 'eth_sendRawTransaction': {
        state.nonce++;
        const txHash = `0x${state.nonce.toString(16).padStart(64, '0')}`;
        state.pendingTxHashes.add(txHash);
        return txHash;
      }

      case 'eth_getTransactionReceipt': {
        const hash = req.params?.[0] as string;
        if (!state.pendingTxHashes.has(hash)) return null;
        return {
          transactionHash: hash,
          transactionIndex: '0x0',
          blockHash: `0x${'cd'.repeat(32)}`,
          blockNumber: `0x${state.blockNumber.toString(16)}`,
          from: `0x${'aa'.repeat(20)}`,
          to: `0x${'bb'.repeat(20)}`,
          cumulativeGasUsed: '0x5208',
          gasUsed: '0x5208',
          contractAddress: null,
          logs: [],
          logsBloom: `0x${'00'.repeat(256)}`,
          status: '0x1',
          effectiveGasPrice: '0x5d21dba00',
          type: '0x2',
        };
      }

      case 'eth_getTransactionByHash': {
        const hash = req.params?.[0] as string;
        if (!state.pendingTxHashes.has(hash)) return null;
        return {
          hash,
          nonce: `0x${state.nonce.toString(16)}`,
          blockHash: `0x${'cd'.repeat(32)}`,
          blockNumber: `0x${state.blockNumber.toString(16)}`,
          from: `0x${'aa'.repeat(20)}`,
          to: `0x${'bb'.repeat(20)}`,
          value: '0x0',
          gas: '0x5208',
          gasPrice: '0x5d21dba00',
          input: '0x',
          type: '0x2',
        };
      }

      case 'shutdown':
        return { success: true };

      default:
        return null;
    }
  };
}

export function createMockRpcServer(port: number): http.Server {
  const avaxState: MockRpcState = {
    blockNumber: 0x300000,
    nonce: 0,
    pendingTxHashes: new Set(),
  };
  const ethState: MockRpcState = {
    blockNumber: 0x1200000,
    nonce: 0,
    pendingTxHashes: new Set(),
  };
  const baseState: MockRpcState = {
    blockNumber: 0x1500000,
    nonce: 0,
    pendingTxHashes: new Set(),
  };

  const avaxHandler = createRpcHandler(avaxState, AVALANCHE_CHAIN_ID);
  const ethHandler = createRpcHandler(ethState, ETHEREUM_CHAIN_ID);
  const baseHandler = createRpcHandler(baseState, BASE_CHAIN_ID);

  function getHandler(url: string) {
    if (url.includes('/base') || url.includes('chainId=8453')) {
      return baseHandler;
    }
    if (
      url.includes('/eth') ||
      url.includes('/ethereum') ||
      url.includes('chainId=1')
    ) {
      return ethHandler;
    }
    return avaxHandler;
  }

  function processRequest(
    handler: (req: JsonRpcRequest) => unknown,
    body: string,
  ): string {
    const parsed = JSON.parse(body);

    if (Array.isArray(parsed)) {
      return JSON.stringify(
        parsed.map(
          (req: JsonRpcRequest): JsonRpcResponse => ({
            id: req.id,
            jsonrpc: '2.0',
            result: handler(req),
          }),
        ),
      );
    }

    return JSON.stringify({
      id: parsed.id,
      jsonrpc: '2.0',
      result: handler(parsed as JsonRpcRequest),
    } satisfies JsonRpcResponse);
  }

  let shuttingDown = false;

  const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end();
      return;
    }

    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      const handler = getHandler(req.url ?? '');

      try {
        const responseBody = processRequest(handler, body);

        const parsed = JSON.parse(body);
        const requests = Array.isArray(parsed) ? parsed : [parsed];
        const hasShutdown = requests.some(
          (r: JsonRpcRequest) => r.method === 'shutdown',
        );

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(responseBody);

        if (hasShutdown && !shuttingDown) {
          shuttingDown = true;
          setTimeout(() => server.close(), 100);
        }
      } catch {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32700, message: 'Parse error' },
            id: null,
          }),
        );
      }
    });
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(
        `[MockRPC] Port ${port} already in use — reusing existing server`,
      );
    } else {
      throw err;
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[MockRPC] Server listening on http://127.0.0.1:${port}`);
  });

  return server;
}

export async function shutdownMockRpcServer(port: number): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'shutdown',
        params: [],
        id: 1,
      }),
    });
    await response.json();
    console.log('[MockRPC] Shutdown request sent');
  } catch {
    // Server may already be down
  }
}
