import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  SolanaColorIcon,
  XPChainIcon,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import curry from 'lodash/curry';
import memoize from 'lodash/memoize';
import { Props as AddressItemProps } from '../AddressItem';

export type AddressType = keyof {
  [AK in keyof Account as AK extends `address${infer VM}` ? VM : never]: AK;
};

type PropsForAddressType = Omit<AddressItemProps, 'address'>;

const COMMON_PROPS: Omit<PropsForAddressType, 'Icon' | 'label'> = {
  truncate: false,
  copyActionVisibility: 'always',
};

export const getAddressItemProps = memoize(
  (type: AddressType): PropsForAddressType => {
    switch (type) {
      case 'C':
        return {
          ...COMMON_PROPS,
          label: 'Avalanche C-Chain',
          Icon: CChainIcon,
        };
      case 'AVM':
        return {
          ...COMMON_PROPS,
          label: 'Avalanche X/P-Chain',
          Icon: XPChainIcon,
        };
      case 'BTC':
        return {
          ...COMMON_PROPS,
          label: 'Bitcoin',
          Icon: BitcoinColorIcon,
        };
      case 'CoreEth':
        return {
          ...COMMON_PROPS,
          label: 'Ethereum',
          Icon: EthereumColorIcon,
        };
      case 'SVM':
        return {
          ...COMMON_PROPS,
          label: 'Solana',
          Icon: SolanaColorIcon,
        };
      default:
        throw new Error(`Unsupported address type: ${type}`);
    }
  },
);

const SEARCH_PARAMS = {
  accountId: 'aid',
  addressType: 'at',
} as const;

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
          [SEARCH_PARAMS.accountId]: accountId,
          [SEARCH_PARAMS.addressType]: addressType,
        }).toString(),
      }),
);

type QRCodeSearchParams = {
  accountId: Account['id'] | undefined;
  addressType: AddressType | undefined;
};

export const getSearchParams = (search: string): QRCodeSearchParams => {
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get(SEARCH_PARAMS.accountId) ?? undefined;
  const type = searchParams.get(SEARCH_PARAMS.addressType) as AddressType;

  return {
    accountId,
    addressType: SUPPORTED_ADDRESSES.includes(type) ? type : undefined,
  };
};
