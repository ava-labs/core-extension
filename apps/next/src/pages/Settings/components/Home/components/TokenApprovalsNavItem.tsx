import { REVOKE_CASH_ADDRESS_URL } from '@/config';
import { useAccountsContext, useAnalyticsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsNavItem } from './SettingsNavItem';

type Props = {
  divider?: boolean;
};

/**
 * Links to a third-party tool (revoke.cash) where the user can list and revoke
 * the ERC-20/721/1155 token approvals granted by the active EVM address.
 */
export const TokenApprovalsNavItem: FC<Props> = ({ divider }) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const addressC = activeAccount?.addressC;

  if (!addressC) {
    return null;
  }

  return (
    <SettingsNavItem
      data-testid="settings-token-approvals-nav-item"
      label={t('Token approvals')}
      description={t(
        'Review and revoke token approvals for this account using revoke.cash, a third-party tool.',
      )}
      href={`${REVOKE_CASH_ADDRESS_URL}${encodeURIComponent(addressC)}`}
      divider={divider}
      onClick={() => capture('TokenApprovalsClicked')}
    />
  );
};
