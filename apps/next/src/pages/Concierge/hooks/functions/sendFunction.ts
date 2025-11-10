import {
  chainIdToCaip,
  getExplorerAddressByNetwork,
  getProviderForNetwork,
  isUserRejectionError,
  stringToBigint,
} from '@core/common';
import { isEvmNativeToken, isErc20Token } from '@core/types';
import { NetworkVMType, RpcMethod } from '@avalabs/vm-module-types';
import { toast } from '@avalabs/k2-alpine';
import { asHex } from '@/pages/Send/components/SendBody/lib/asHex';
import { buildErc20SendTx } from '@/pages/Send/components/SendBody/lib/buildErc20SendTx';
import { getEvmProvider } from '@/lib/getEvmProvider';
import { TFunction } from 'i18next';

export interface SendFunctionParams {
  recipient: string;
  token: string;
  amount: string;
}

export interface SendFunctionDeps {
  accounts: any;
  network: any;
  tokensForAccount: any[];
  getNetworkFee: (chainId: string) => Promise<any>;
  request: (params: any, options?: any) => Promise<any>;
  t: TFunction;
}

export const createSendFunction = ({
  accounts,
  network,
  tokensForAccount,
  getNetworkFee,
  request,
  t,
}: SendFunctionDeps) => {
  return async ({ recipient, token, amount }: SendFunctionParams) => {
    if (!accounts.active) {
      throw new Error(`You don't have an active account`);
    }
    if (!network) {
      throw new Error(`No network`);
    }
    if (network.vmName !== NetworkVMType.EVM) {
      throw new Error('Only EVM networks supported at the moment');
    }

    const provider = await getProviderForNetwork(network);
    if (!provider) {
      throw new Error(`No network`);
    }

    const tokenToSend = tokensForAccount.find((item) => item.symbol === token);

    if (!tokenToSend) {
      throw new Error(`Cannot find token`);
    }
    const amountBigInt = stringToBigint(amount || '0', tokenToSend.decimals);
    const account = accounts.active;

    const isNativeToken = isEvmNativeToken(tokenToSend);
    const isErc20 = isErc20Token(tokenToSend);

    if (isNativeToken) {
      const networkFee = await getNetworkFee(String(tokenToSend.coreChainId));

      if (!networkFee) {
        throw new Error('Network fee not found');
      }
      try {
        const hash = await request(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              {
                from: account.addressC,
                to: recipient,
                value: asHex(amountBigInt),
                chainId: asHex(tokenToSend.coreChainId),
                maxFeePerGas: asHex(networkFee.high.maxFeePerGas),
                maxPriorityFeePerGas: asHex(
                  networkFee.high.maxPriorityFeePerGas ?? 1n,
                ),
              },
            ],
          },
          {
            scope: chainIdToCaip(tokenToSend.coreChainId),
          },
        );
        return {
          recipient,
          token: tokenToSend,
          amount,
          content: `Transaction successful. Tx hash: ${hash}`,
          link: getExplorerAddressByNetwork(network, hash),
        };
      } catch (e) {
        if (isUserRejectionError(e)) {
          throw new Error('User rejected the transaction');
        }
        throw new Error('Transaction failed');
      }
    }

    if (isErc20) {
      const evmProvider = getEvmProvider(network);
      const networkFee = await getNetworkFee(String(tokenToSend.coreChainId));

      if (!networkFee) {
        toast.error(t('Unable to estimate the network fee.'));
        return;
      }
      try {
        const tx = await buildErc20SendTx(
          account.addressC,
          evmProvider,
          networkFee,
          {
            address: recipient,
            amount: amountBigInt,
            token: tokenToSend,
          },
        );

        const hash = await request(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [tx],
          },
          {
            scope: chainIdToCaip(tokenToSend.coreChainId),
          },
        );
        return {
          recipient,
          token: tokenToSend,
          amount,
          content: `Transaction successful. Tx hash: ${hash}`,
          link: getExplorerAddressByNetwork(network, hash),
        };
      } catch (e) {
        if (isUserRejectionError(e)) {
          throw new Error('User rejected the transaction');
        }
        throw new Error('Transaction failed');
      }
    }

    throw new Error('You can only send native tokens or ERC20 tokens');
  };
};
