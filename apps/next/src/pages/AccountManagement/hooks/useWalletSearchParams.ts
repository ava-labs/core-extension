import { WalletDetails } from '@core/types';
import { useWalletContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { URL_SEARCH_TOKENS } from '../utils/searchParams';

type UseWalletSearchParams =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      wallet: WalletDetails;
    };

export function useWalletSearchParams(): UseWalletSearchParams {
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const { getWallet } = useWalletContext();
  const id = searchParams.get(URL_SEARCH_TOKENS.wallet);

  if (!id) {
    return {
      success: false,
      error: t('Wallet ID is not provided'),
    };
  }

  const wallet = getWallet(id);

  if (wallet === undefined) {
    return {
      success: false,
      error: t('Wallet not found'),
    };
  }

  return {
    success: true,
    wallet,
  };
}
