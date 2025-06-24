import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  SolanaColorIcon,
  XPChainIcon,
} from '@avalabs/k2-alpine';
import memoize from 'lodash/memoize';
import { Account } from '@core/types';
import { IconBaseProps } from 'react-icons';

export type Chain = 'CChain' | 'PChain' | 'XChain' | 'BTC' | 'ETH' | 'SOL';

type CommonProps = {
  label: string;
  address: string | undefined;
  Icon: React.ComponentType<IconBaseProps>;
};

export const getAddressItemProps = memoize(
  (chain: Chain, account: Account): CommonProps => {
    switch (chain) {
      case 'CChain':
        return {
          label: 'Avalanche C-Chain',
          address: account.addressC,
          Icon: CChainIcon,
        };
      case 'PChain':
      case 'XChain':
        return {
          label: 'Avalanche X/P-Chain',
          address: account.addressAVM,
          Icon: XPChainIcon,
        };
      case 'BTC':
        return {
          label: 'Bitcoin',
          address: account.addressBTC,
          Icon: BitcoinColorIcon,
        };
      case 'ETH':
        return {
          label: 'Ethereum',
          address: account.addressC,
          Icon: EthereumColorIcon,
        };
      case 'SOL':
        return {
          label: 'Solana',
          address: account.addressSVM,
          Icon: SolanaColorIcon,
        };
    }
  },
  (token, account) => `${token}-${account.id}`,
);
