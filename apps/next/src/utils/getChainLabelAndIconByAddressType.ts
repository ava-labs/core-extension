import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  SolanaColorIcon,
} from '@avalabs/k2-alpine';
import { AddressType } from '@core/types';
import { memoize } from 'lodash';
import { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';

import { FixedXPChainIcon } from '@/components/AddressSelector/components/Icons';

type AddressLabelAndIcon = {
  label: string;
  Icon: ComponentType<IconBaseProps>;
};

export const getChainLabelAndIconByAddressType = memoize(
  (type: AddressType): AddressLabelAndIcon => {
    switch (type) {
      case 'C':
        return {
          label: 'Avalanche C-Chain / EVM',
          Icon: AvalancheColorIcon,
        };
      case 'AVM':
      case 'PVM':
        return {
          label: 'Avalanche X/P-Chain',
          Icon: FixedXPChainIcon,
        };
      case 'BTC':
        return {
          label: 'Bitcoin',
          Icon: BitcoinColorIcon,
        };
      case 'SVM':
        return {
          label: 'Solana',
          Icon: SolanaColorIcon,
        };
      default:
        throw new Error(`Unsupported address type: ${type}`);
    }
  },
);
