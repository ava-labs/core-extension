import {
  ChevronRightIcon,
  InfoCircleIcon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
} from '@avalabs/core-k2-components';
import { isProductionBuild } from '@core/common';
import { AccountType, FeatureGates } from '@core/types';
import {
  SettingsPages,
  useAccountsContext,
  useAnalyticsContext,
  useBridgeContext,
  useFeatureFlagContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { setDeveloperMode, isDeveloperMode } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { isBridgeDevEnv, setIsBridgeDevEnv } = useBridgeContext();
  const { capture } = useAnalyticsContext();
  const {
    showTokensWithoutBalances,
    toggleShowTokensWithoutBalanceSetting,
    setCoreAssistant,
    coreAssistant,
  } = useSettingsContext();
  const history = useHistory();
  const { featureFlags } = useFeatureFlagContext();

  const testnetModeUnavailableReason = useMemo(() => {
    const isFireblocksAccount = activeAccount?.type === AccountType.FIREBLOCKS;

    if (isProductionBuild() && isFireblocksAccount && !isDeveloperMode) {
      return t('Fireblocks accounts do not support the Testnet Mode currently');
    }

    return '';
  }, [activeAccount, isDeveloperMode, t]);

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Advanced')}
      />
      <List>
        <ListItem data-testid="test-net-mode-menu-item">
          <ListItemText
            sx={{ alignItems: 'center', flex: 'none' }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            {t('Testnet Mode')}
          </ListItemText>
          <Tooltip
            sx={{ ml: 0.5 }}
            PopperProps={{
              sx: {
                maxWidth: '240px',
              },
            }}
            title={t(
              'Testnet mode changes the interface to allow you to interact with supported testnets.',
            )}
          >
            <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
          </Tooltip>
          <Tooltip title={testnetModeUnavailableReason} sx={{ ml: 'auto' }}>
            <Switch
              size="small"
              checked={isDeveloperMode}
              disabled={Boolean(testnetModeUnavailableReason)}
              onChange={() => {
                const isEnabled = !isDeveloperMode;
                setDeveloperMode(isEnabled);
                capture(
                  isEnabled ? 'DeveloperModeEnabled' : 'DeveloperModeDisabled',
                );
                history.push('/home');
              }}
              sx={{
                ml: 'auto',
                cursor: testnetModeUnavailableReason
                  ? 'not-allowed'
                  : 'pointer',
              }}
            />
          </Tooltip>
        </ListItem>
        {featureFlags[FeatureGates.CORE_ASSISTANT] && (
          <ListItem data-testid="core-assistant-menu-item">
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
              {t('Core Assistant')}
            </ListItemText>
            <Switch
              size="small"
              checked={coreAssistant}
              onChange={() => setCoreAssistant(!coreAssistant)}
            />
          </ListItem>
        )}
        {!isProductionBuild() ? (
          <ListItem data-testid="bridge-dev-env-menu-item">
            <ListItemText
              sx={{ alignItems: 'center', flex: 'none' }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Bridge DEV Environment')}
            </ListItemText>
            <Tooltip
              sx={{ ml: 0.5 }}
              PopperProps={{
                sx: {
                  maxWidth: '240px',
                },
              }}
              title={
                <Trans i18nKey="When both this AND Testnet Mode are enabled then the Bridge will use the DEV warden config.<br /><br />Only available for internal builds." />
              }
            >
              <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
            </Tooltip>
            <Switch
              size="small"
              checked={isBridgeDevEnv}
              onChange={() => {
                setIsBridgeDevEnv(!isBridgeDevEnv);
              }}
              sx={{ ml: 'auto' }}
            />
          </ListItem>
        ) : undefined}
        <ListItem data-testid="show-tokens-without-balance-option">
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            {t('Show Tokens Without Balance')}
          </ListItemText>
          <Switch
            size="small"
            checked={showTokensWithoutBalances}
            onChange={() => toggleShowTokensWithoutBalanceSetting()}
          />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              justifyContent: 'space-between',
              py: 1,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            data-testid="notification-settings-menu-item"
            onClick={() => {
              capture('NotificationSettingsClicked');
              navigateTo(SettingsPages.NOTIFICATIONS);
            }}
          >
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
              {t('Notifications')}
            </ListItemText>

            <ListItemIcon>
              <ChevronRightIcon size={24} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
}
