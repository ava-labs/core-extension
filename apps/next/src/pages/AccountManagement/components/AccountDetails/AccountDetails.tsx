import {
  getHexAlpha,
  Stack,
  styled,
  toast,
  ToastOptions,
} from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { DetailsView } from './components/DetailsView';
import { ActionButtons } from '@/components/ActionButtons';
import { useTranslation } from 'react-i18next';
import { useAccountManager } from '@core/ui';

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

  const switchTo = useMemo(
    () => ({
      rename: () =>
        push({
          pathname: '/account-management/rename',
          search,
        }),
      remove: () =>
        push({
          pathname: '/account-management/delete-account',
          search,
        }),
    }),
    [push, search],
  );

  if (!accountParams.success) {
    toast.error(accountParams.error, toastOptions);
    return <Redirect to="/account-management" />;
  }

  const { account } = accountParams;

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
          bottom={{
            label: t('Remove account'),
            onClick: switchTo.remove,
            color: 'secondary',
            panic: true,
            disabled: !isAccountSelectable(account),
          }}
        />
      </ActionButtonsContainer>
    </Page>
  );
};

const ActionButtonsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  height: '122px',
  marginLeft: `-${theme.spacing(2)}`,
  marginRight: `-${theme.spacing(2)}`,
  paddingTop: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBottom: theme.spacing(1.5),
  marginBottom: `-${theme.spacing(1.5)}`,
  background: `linear-gradient(180deg, ${getHexAlpha(theme.palette.background.paper, 0)} 0%, ${theme.palette.background.paper} 42%)`,
  '> div': {
    borderRadius: theme.shape.mediumBorderRadius,
    background: theme.palette.background.paper,
  },
}));
