import { Account } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type AtLeastOneArray<T> = [T, ...T[]];

type UseAccountSearchParams<Multiple extends boolean> =
  | {
      success: false;
      error: string;
    }
  | (Multiple extends true
      ? {
          success: true;
          accounts: AtLeastOneArray<Account>;
        }
      : {
          success: true;
          account: Account;
        });

export function useAccountSearchParams<Multiple extends boolean = false>(
  multiple: Multiple = false as Multiple,
): UseAccountSearchParams<Multiple> {
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const { getAccountById } = useAccountsContext();
  const ids = searchParams.getAll('accountId');

  if (ids.length === 0) {
    return {
      success: false,
      error: t('Account ID is not provided'),
    };
  }

  const accounts = ids.map((id) => getAccountById(id));
  const validAccounts = accounts.filter((account) => account !== undefined);

  if (!isAtLeastOne(validAccounts)) {
    return {
      success: false,
      error: t('Account not found'),
    };
  }

  if (multiple === true) {
    return {
      success: true,
      accounts: validAccounts,
    } as UseAccountSearchParams<Multiple>;
  }

  const [account] = validAccounts;

  return {
    success: true,
    account,
  } as UseAccountSearchParams<Multiple>;
}

function isAtLeastOne<T>(value: T[]): value is AtLeastOneArray<T> {
  return value.length > 0;
}
