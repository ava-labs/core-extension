import Joi from 'joi';

const VERSION = 2;

// Schemas & types below only list the relevant properties
// that actually changed. The rest is untouched & untyped.
type LegacyBridgeTransfer = {
  amountDecimals?: number; // the very first version of the SDK did not have it
  symbol: string;
  sourceChain: {
    chainId: string;
  };
  requiredSourceConfirmationCount: number;
  requiredTargetConfirmationCount: number;
  startBlockNumber?: number | bigint; // Even though types say it's always a bigint, I've seen it as a number in my storage.
};

type NewBridgeTransfer = {
  asset: {
    type: 'erc20';
    address?: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  sourceRequiredConfirmationCount: number;
  targetRequiredConfirmationCount: number;
  targetStartBlockNumber?: bigint;
};

type PreviousSchema = {
  pendingTransfers?: Record<string, LegacyBridgeTransfer>;
  addresses?: string[];
  version?: number;
};

type NewSchema = {
  pendingTransfers?: Record<string, NewBridgeTransfer>;
};

const previousSchema = Joi.object<PreviousSchema>({
  addresses: Joi.array().items(Joi.string()).optional(),
  pendingTransfers: Joi.object().pattern(
    Joi.string(),
    Joi.object<LegacyBridgeTransfer>({
      amountDecimals: Joi.number(),
      symbol: Joi.string(),
      requiredSourceConfirmationCount: Joi.number(),
      requiredTargetConfirmationCount: Joi.number(),
      startBlockNumber: Joi.custom((value) => {
        // Joi has no support for BigInt
        if (
          typeof value !== 'number' &&
          typeof value !== 'bigint' &&
          typeof value !== 'undefined'
        ) {
          return new Error(
            `Expected bigint or number, received ${typeof value}`,
          );
        }

        return value;
      }, 'bigint'),
      sourceChain: Joi.object({ chainId: Joi.string() }).unknown(true),
    }).unknown(true),
  ),
}).unknown(true);

const getUsdcAddressByChainId = (caipId: string) => {
  switch (caipId) {
    case 'eip155:1': // Ethereum Mainnet
      return '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

    case 'eip155:43114': // C-Chain Mainnet
      return '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';

    case 'eip155:11155111': // Ethereum Sepolia
      return '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

    case 'eip155:43113': // C-Chain Fuji
      return '0x5425890298aed601595a70ab815c96711a31bc65';
  }
};

const up = async (
  unifiedBridgeState: PreviousSchema,
): Promise<NewSchema & { version: number }> => {
  const { pendingTransfers: oldTransfers } = unifiedBridgeState;

  const newTransfers: Record<string, NewBridgeTransfer> = {};

  if (oldTransfers !== undefined) {
    for (const [id, transfer] of Object.entries(oldTransfers)) {
      const {
        amountDecimals,
        symbol,
        requiredSourceConfirmationCount,
        requiredTargetConfirmationCount,
        startBlockNumber,
        ...rest
      } = transfer;

      newTransfers[id] = {
        ...rest,
        asset: {
          // Prior to this schema upgrade, only USDC was possible to bridge (via CCTP)
          decimals: amountDecimals ?? 6,
          symbol,
          type: 'erc20',
          name: 'USD Coin',
          address: getUsdcAddressByChainId(rest.sourceChain.chainId),
        },
        sourceRequiredConfirmationCount: requiredSourceConfirmationCount,
        targetRequiredConfirmationCount: requiredTargetConfirmationCount,
        targetStartBlockNumber:
          typeof startBlockNumber !== 'undefined'
            ? BigInt(startBlockNumber)
            : undefined,
      };
    }
  }

  return {
    pendingTransfers: newTransfers,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
