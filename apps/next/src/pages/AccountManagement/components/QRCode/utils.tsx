import { Account, AddressType } from '@core/types';
import { History } from 'history';
import curry from 'lodash/curry';
import { URL_SEARCH_TOKENS } from '../../utils/searchParams';

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
