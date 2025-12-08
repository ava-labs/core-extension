import { alpha, Stack, styled, toast, ToastOptions } from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { DetailsView } from './components/DetailsView';
import { ActionButtons } from '@/components/ActionButtons';
import { useTranslation } from 'react-i18next';
import { useAccountManager, useWalletContext } from '@core/ui';
import { URL_SEARCH_TOKENS } from '../../utils/searchParams';
import { isPrimaryAccount } from '@core/common';
import { SecretType } from '@core/types';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

export const AccountDetails: FC = () => {
  const accountParams = useAccountSearchParams();
  const {
    push,
    location: { search },
  } = useHistory();
  const { t } = useTranslation();
  const { isAccountSelectable } = useAccountManager();
  const { getWallet } = useWalletContext();

  const switchTo = useMemo(
    () => ({
      rename: () =>
        push({
          pathname: '/account-management/rename',
          search,
        }),
      remove: () => {
        const params = new URLSearchParams(search);
        params.set(URL_SEARCH_TOKENS.bulkMode, 'false');
        push({
          pathname: '/account-management/delete-account',
          search: params.toString(),
        });
      },
    }),
    [push, search],
  );

  if (!accountParams.success) {
    toast.error(accountParams.error, toastOptions);
    return <Redirect to="/account-management" />;
  }

  const { account } = accountParams;

  const isSeedlessWalletAccount =
    isPrimaryAccount(account) &&
    getWallet(account.walletId)?.type === SecretType.Seedless;

  return (
    <Page
      withBackButton
      containerProps={{
        mt: 3,
      }}
      contentProps={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <DetailsView account={account} />
      <ActionButtonsContainer>
        <ActionButtons
          top={{
            label: t('Rename'),
            onClick: switchTo.rename,
            color: 'secondary',
          }}
          bottom={
            isSeedlessWalletAccount
              ? undefined
              : {
                  label: t('Remove account'),
                  onClick: switchTo.remove,
                  color: 'secondary',
                  panic: true,
                  disabled: !isAccountSelectable(account),
                }
          }
        />
      </ActionButtonsContainer>
    </Page>
  );
};

const ActionButtonsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 100,
  height: '122px',
  marginLeft: `-${theme.spacing(1.5)}`,
  marginRight: `-${theme.spacing(1.5)}`,
  paddingTop: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBottom: theme.spacing(1.5),
  marginBottom: `-${theme.spacing(1.5)}`,
  background: `linear-gradient(180deg, ${alpha(theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default, 0)} 0%, 
	${theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default} 32px)`,

  '> div': {
    background: 'unset',
  },
}));
