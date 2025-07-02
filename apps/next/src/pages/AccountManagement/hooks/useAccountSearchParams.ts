import { Account } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type UseAccountSearchParams =
  | {
      success: true;
      account: Account;
    }
  | {
      success: false;
      error: string;
    };

export function useAccountSearchParams(): UseAccountSearchParams {
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get('accountId');
  const { getAccountById } = useAccountsContext();

  if (!accountId) {
    return {
      success: false,
      error: t('Account ID is not provided'),
    };
  }

  const account = getAccountById(accountId);

  if (!account) {
    return {
      success: false,
      error: t('Account not found'),
    };
  }

  return {
    success: true,
    account,
  };
}
