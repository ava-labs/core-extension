import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  SolanaColorIcon,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import curry from 'lodash/curry';
import memoize from 'lodash/memoize';
import { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { URL_SEARCH_TOKENS } from '../../utils/searchParams';
import { FixedXPChainIcon } from './components/AddressSelector/components/Icons';

export type AddressType = keyof {
  [AK in keyof Account as AK extends `address${infer VM}` ? VM : never]: AK;
};

type AddressLabelAndIcon = {
  label: string;
  Icon: ComponentType<IconBaseProps>;
};

export const getLabelAndIcon = memoize(
  (type: AddressType): AddressLabelAndIcon => {
    switch (type) {
      case 'C':
        return {
          label: 'Avalanche C-Chain / EVM',
          Icon: AvalancheColorIcon,
        };
      case 'AVM':
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

const SUPPORTED_ADDRESSES: string[] = [
  'C',
  'AVM',
  'BTC',
  'SVM',
] satisfies AddressType[];

export const getNavigateToQRCode = curry(
  (
    navigate: History['push' | 'replace'],
    accountId: string,
    addressType: AddressType,
  ) =>
    () =>
      navigate({
        pathname: '/account-management/qr-code',
        search: new URLSearchParams({
          [URL_SEARCH_TOKENS.account]: accountId,
          [URL_SEARCH_TOKENS.addressType]: addressType,
        }).toString(),
      }),
);

type QRCodeSearchParams = {
  accountId: Account['id'] | undefined;
  addressType: AddressType | undefined;
};

export const getSearchParams = (search: string): QRCodeSearchParams => {
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get(URL_SEARCH_TOKENS.account) ?? undefined;
  const type = searchParams.get(URL_SEARCH_TOKENS.addressType) as AddressType;

  return {
    accountId,
    addressType: SUPPORTED_ADDRESSES.includes(type) ? type : undefined,
  };
};
