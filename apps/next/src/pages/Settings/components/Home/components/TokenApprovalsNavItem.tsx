import { CORE_WEB_BASE_URL } from '@/config';
import { useAnalyticsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsNavItem } from './SettingsNavItem';

type Props = {
  divider?: boolean;
};

/**
 * Links to Core's own Revoke Access tool on core.app, where the user connects
 * Core and can list and revoke the token approvals granted by their accounts.
 */
export const TokenApprovalsNavItem: FC<Props> = ({ divider }) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <SettingsNavItem
      data-testid="settings-token-approvals-nav-item"
      label={t('Token approvals')}
      description={t('Review and revoke token approvals on core.app.')}
      href={`${CORE_WEB_BASE_URL}/tools/revoke-access`}
      divider={divider}
      onClick={() => capture('TokenApprovalsClicked')}
    />
  );
};
