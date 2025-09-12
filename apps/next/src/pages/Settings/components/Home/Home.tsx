import {
  Button,
  ChevronRightIcon,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';

import {
  useAnalyticsContext,
  useContactsContext,
  useNetworkContext,
  useSettingsContext,
  useWalletContext,
  useSeedlessMfaManager,
  useFeatureFlagContext,
} from '@core/ui';

import { LanguageSelector } from '@/components/LanguageSelector';
import { Page } from '@/components/Page';
import { SwitchCard } from '@/components/SwitchCard';
import {
  BUG_BOUNTIES_URL,
  CORE_FEATURE_REQUEST_URL,
  CORE_FEEDBACK_URL,
  CORE_SUPPORT_URL,
  CORE_WEB_BASE_URL,
} from '@/config';

import { getContactsPath } from '@/config/routes';
import { FeatureGates, SecretType } from '@core/types';
import {
  AvatarButton,
  Footer,
  SettingsCard,
  SettingsNavItem,
} from './components';
import { CurrencySelector } from '../CurrencySelector';
import { ThemeSelector } from '../ThemeSelector';
import { ViewPreferenceSelector } from '../ViewPreferenceSelector';
import { Card } from '@/components/Card';

export const SettingsHomePage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { lockWallet } = useSettingsContext();
  const { isDeveloperMode, setDeveloperMode } = useNetworkContext();
  const { walletDetails } = useWalletContext();
  const { contacts } = useContactsContext();
  const { path } = useRouteMatch();
  const { push } = useHistory();
  const { capture } = useAnalyticsContext();

  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isCoreAiEnabled, setIsCoreAiEnabled] = useState(false);
  const { showTrendingTokens, setShowTrendingTokens } = useSettingsContext();
  const { isMfaSetupPromptVisible } = useSeedlessMfaManager();
  const { featureFlags } = useFeatureFlagContext();
  const areMfaSettingsAvailable =
    featureFlags[FeatureGates.SEEEDLESS_MFA_SETTINGS];

  return (
    <Page
      title={t('Settings')}
      description={t(
        'Manage and customize your Core experience to your liking.',
      )}
      withBackButton
    >
      <Stack direction="row" justifyContent="space-between" gap={1.5}>
        <SwitchCard
          titleSize="small"
          checked={isDeveloperMode}
          onChange={() => setDeveloperMode(!isDeveloperMode)}
          title={t('Testnet mode')}
          description={t(
            'Enable a sandbox environment for testing without using real funds',
          )}
        />
        <SwitchCard
          titleSize="small"
          checked={isPrivacyMode}
          onChange={() => setIsPrivacyMode((is) => !is)}
          title={t('Privacy mode')}
          description={t(
            'Hide your wallet balance on the portfolio screen for added privacy',
          )}
        />
      </Stack>

      {isMfaSetupPromptVisible && (
        <Card
          sx={{
            width: '100%',
            px: theme.spacing(1.5),
            py: theme.spacing(0.75),
            gap: theme.spacing(1.5),
          }}
        >
          <SettingsNavItem
            label={t('No recovery methods set up')}
            href={`${path}/recovery-methods`}
            description={t('Finish setting up recovery methods')}
            divider
            secondaryAction={
              <Button size="small" variant="contained" color="secondary">
                {t('Set up ')}
              </Button>
            }
            labelTpyographyVariant="subtitle3"
            descriptionTpyographyVariant="caption2"
            sx={{ borderBottom: 'none' }}
          />
        </Card>
      )}

      <SettingsCard
        title={t('General')}
        description={t(
          'Tweak and customize interface elements and display settings.',
        )}
      >
        <SettingsNavItem
          label={t('My avatar')}
          secondaryAction={
            <AvatarButton onClick={() => push('/settings/avatar')} />
          }
          divider
        />
        <SettingsNavItem
          divider
          label={t('Currency')}
          secondaryAction={
            <CurrencySelector
              sx={{ px: 1, mr: -0.5, gap: 0, color: 'text.secondary' }}
            />
          }
        />
        <SettingsNavItem
          divider
          label={t('Language')}
          secondaryAction={
            <LanguageSelector
              dataTestId="settings-language-selector"
              onSelectEventName="AppLanguageChanged"
              sx={{ px: 1, mr: -0.5, gap: 0, color: 'text.secondary' }}
            />
          }
        />
        <SettingsNavItem
          label={t('Theme')}
          divider
          secondaryAction={
            <ThemeSelector
              sx={{ px: 1, mr: -0.5, gap: 0, color: 'text.secondary' }}
            />
          }
        />
        <SettingsNavItem
          label={t('View preference')}
          divider
          secondaryAction={
            <ViewPreferenceSelector
              sx={{ px: 1, mr: -0.5, gap: 0, color: 'text.secondary' }}
            />
          }
        />
        <SettingsNavItem
          label={t('Networks')}
          href={`${path}/network-management`}
          divider
        />
        <SettingsNavItem
          label={t('Show me Trending Tokens')}
          description={t(
            'Display the shortcut to tokens that are trending in the last 24 hours',
          )}
          secondaryAction={
            <Switch
              size="small"
              checked={showTrendingTokens}
              onChange={() => {
                const newValue = !showTrendingTokens;
                setShowTrendingTokens(newValue);
                capture('ShowTrendingTokensSettingChanged', {
                  showTrendingTokens: newValue,
                });
              }}
            />
          }
        />
      </SettingsCard>
      <SwitchCard
        title={t('Core Concierge')}
        titleSize="large"
        orientation="horizontal"
        description={t(
          'Get Core to work for you. Whether it’s transferring, sending crypto, just ask away!',
        )}
        checked={isCoreAiEnabled}
        onChange={() => setIsCoreAiEnabled((is) => !is)}
      />
      <SettingsCard
        title={t('Privacy and security')}
        description={t(
          'Protect your data and ensure the highest level of security for your Core wallet.',
        )}
      >
        <SettingsNavItem
          label={t('Connected sites')}
          href={`${path}/connected-sites`}
          divider
        />
        <SettingsNavItem
          label={t('Change password')}
          divider
          href={`${path}/change-password`}
        />
        {!isMfaSetupPromptVisible &&
          (walletDetails?.type === SecretType.Mnemonic ||
            walletDetails?.type === SecretType.Seedless) && (
            <SettingsNavItem
              label={t('Show recovery phrase')}
              href={`${path}/recovery-phrase/show-phrase`}
              divider
            />
          )}
        <SettingsNavItem label={t('Reset recovery phrase')} divider />

        {walletDetails?.type === SecretType.Seedless &&
          areMfaSettingsAvailable && (
            <SettingsNavItem
              label={t('Recovery methods')}
              divider
              href={`${path}/recovery-methods`}
            />
          )}

        <SettingsNavItem
          label={t('Participate in Core Analytics')}
          description={t(
            'Core Analytics will collect anonymous interaction data. Core is committed to protecting your privacy. We will never sell or share your data.',
          )}
          secondaryAction={<Switch size="small" />}
        />
      </SettingsCard>
      <SettingsCard title={t('Contacts')}>
        <SettingsNavItem
          label={t('Saved addresses')}
          href={getContactsPath('list')}
          secondaryAction={
            <Stack direction="row" gap={0.5} alignItems="center">
              <Typography variant="body3" color="text.secondary">
                {contacts.length}
              </Typography>
              <ChevronRightIcon size={20} />
            </Stack>
          }
        />
      </SettingsCard>
      <SettingsCard title={t('About & support')}>
        <SettingsNavItem
          label={t('Core.app')}
          href={CORE_WEB_BASE_URL}
          divider
        />
        <SettingsNavItem
          label={t('Bug bounties')}
          href={BUG_BOUNTIES_URL}
          divider
        />
        <SettingsNavItem
          label={t('Request a feature')}
          href={CORE_FEATURE_REQUEST_URL}
          divider
        />
        <SettingsNavItem
          label={t('Send feedback')}
          href={CORE_FEEDBACK_URL}
          divider
        />
        <SettingsNavItem label={t('Help center')} href={CORE_SUPPORT_URL} />
      </SettingsCard>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={lockWallet}
      >
        {t('Lock Core')}
      </Button>
      <Footer mt={4} />
    </Page>
  );
};
