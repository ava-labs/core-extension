import {
  Button,
  ChevronRightIcon,
  Stack,
  Switch,
  SxProps,
  toast,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';

import {
  useAnalyticsContext,
  useContactsContext,
  useFeatureFlagContext,
  useNetworkContext,
  useSeedlessMfaManager,
  useSettingsContext,
  useWalletContext,
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

import { Card } from '@/components/Card';
import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { getContactsPath } from '@/config/routes';
import { AnalyticsConsent, FeatureGates, SecretType } from '@core/types';
import { CurrencySelector } from '../CurrencySelector';
import { ThemeSelector } from '../ThemeSelector';
import { ViewPreferenceSelector } from '../ViewPreferenceSelector';
import {
  AvatarButton,
  Footer,
  SettingsCard,
  SettingsNavItem,
} from './components';
import { useMediaQuery } from '@avalabs/k2-alpine';

const navItemActionCommonSx: SxProps = {
  px: 1,
  mr: -0.5,
  gap: 0,
  color: 'text.secondary',
};

export const SettingsHomePage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { lockWallet } = useSettingsContext();
  const { isDeveloperMode, setDeveloperMode } = useNetworkContext();
  const { walletDetails, isLedgerWallet } = useWalletContext();
  const { contacts } = useContactsContext();
  const { path } = useRouteMatch();
  const { push } = useHistory();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();

  const {
    showTrendingTokens,
    setShowTrendingTokens,
    coreAssistant,
    setCoreAssistant,
    analyticsConsent,
    setAnalyticsConsent,
    privacyMode,
    setPrivacyMode,
  } = useSettingsContext();
  const { isMfaSetupPromptVisible } = useSeedlessMfaManager();
  const isMfaSettingsAvailable =
    featureFlags[FeatureGates.SEEEDLESS_MFA_SETTINGS];
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Page
      title={t('Settings')}
      description={t(
        'Manage and customize your Core experience to your liking.',
      )}
      withBackButton
      onBack={() => {
        push('/');
      }}
    >
      <Stack direction="row" gap={1.5} width="100%">
        <Stack width="50%">
          <SwitchCard
            titleSize="large"
            checked={isDeveloperMode}
            onChange={() => {
              setDeveloperMode(!isDeveloperMode);
              toast.info(
                isDeveloperMode
                  ? t('Testnet mode is off')
                  : t('Testnet mode is on'),
              );
            }}
            title={t('Testnet mode')}
            description={t(
              'Enable a sandbox environment for testing without using real funds',
            )}
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
          />
        </Stack>
        <Stack width="50%">
          <SwitchCard
            titleSize="large"
            checked={privacyMode}
            onChange={() => {
              const newValue = !privacyMode;
              setPrivacyMode(newValue);
              toast.info(
                newValue ? t('Privacy mode is on') : t('Privacy mode is off'),
              );
            }}
            title={t('Privacy mode')}
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
            description={t(
              'Hide your wallet balance on the portfolio screen for added privacy',
            )}
          />
        </Stack>
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
            labelVariant="subtitle3"
            descriptionVariant="caption2"
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
          onClick={() => capture('CurrencySettingClicked')}
          secondaryAction={<CurrencySelector sx={navItemActionCommonSx} />}
        />
        {featureFlags[FeatureGates.LANGUAGES] && (
          <SettingsNavItem
            divider
            label={t('Language')}
            secondaryAction={
              <LanguageSelector
                dataTestId="settings-language-selector"
                onSelectEventName="AppLanguageChanged"
                sx={navItemActionCommonSx}
              />
            }
          />
        )}
        <SettingsNavItem
          label={t('Theme')}
          divider
          secondaryAction={
            <ThemeSelector
              sx={{
                ...navItemActionCommonSx,
                justifyContent: 'flex-end',
              }}
            />
          }
        />
        <SettingsNavItem
          label={t('View preference')}
          divider
          secondaryAction={
            <ViewPreferenceSelector sx={navItemActionCommonSx} />
          }
        />
        <SettingsNavItem
          label={t('Networks')}
          href={`${path}/network-management`}
          divider
          onClick={() => capture('ManageNetworksClicked')}
        />
        {isLedgerWallet && (
          <SettingsNavItem
            label={t('Ledger')}
            href={`${path}/ledger-device-status`}
            divider
          />
        )}
        <SettingsNavItem
          label={t('Show me Trending Tokens')}
          description={t(
            'Display the shortcut to tokens that are trending in the last 24 hours',
          )}
          sx={{
            pb: 0,
          }}
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
      {featureFlags[FeatureGates.CORE_ASSISTANT] && (
        <Stack width="100%">
          <SwitchCard
            title={t('Core Concierge')}
            titleSize="large"
            orientation="horizontal"
            descriptionColor="text.primary"
            description={t(
              'Get Core to work for you. Whether it’s transferring, sending crypto, just ask away!',
            )}
            checked={coreAssistant}
            onChange={() => setCoreAssistant(!coreAssistant)}
          />
        </Stack>
      )}
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
          onClick={() => capture('ConnectedSitesClicked')}
        />
        <SettingsNavItem
          label={t('Change password')}
          divider
          href={`${path}/change-password`}
          onClick={() => capture('ChangePasswordClicked')}
        />
        {!isMfaSetupPromptVisible &&
          (walletDetails?.type === SecretType.Mnemonic ||
            walletDetails?.type === SecretType.Seedless) && (
            <SettingsNavItem
              label={t('Show recovery phrase')}
              href={`${path}/recovery-phrase/show-phrase`}
              divider
              onClick={() => capture('RecoveryPhraseClicked')}
            />
          )}
        <SettingsNavItem
          label={t('Reset recovery phrase')}
          divider
          onClick={() => capture('RecoveryPhraseResetClicked')}
          href={`${path}/reset`}
        />

        {walletDetails?.type === SecretType.Seedless &&
          isMfaSettingsAvailable && (
            <SettingsNavItem
              label={t('Recovery methods')}
              divider
              href={`${path}/recovery-methods`}
              onClick={() => capture('RecoveryMethodsClicked')}
            />
          )}

        <SettingsNavItem
          label={t('Participate in Core Analytics')}
          description={t(
            'Core Analytics will collect anonymous interaction data. Core is committed to protecting your privacy. We will never sell or share your data.',
          )}
          sx={{
            pb: 0,
          }}
          secondaryAction={
            <Switch
              size="small"
              checked={analyticsConsent === AnalyticsConsent.Approved}
              onChange={() => {
                const newValue =
                  analyticsConsent === AnalyticsConsent.Approved ? false : true;
                capture('AnalyticsConsentSettingChanged', {
                  showTrendingTokens: newValue,
                });
                setAnalyticsConsent(newValue);
              }}
            />
          }
        />
      </SettingsCard>
      <SettingsCard title={t('Contacts')}>
        <SettingsNavItem
          label={t('Saved addresses')}
          href={getContactsPath('list')}
          sx={{
            py: 0,
          }}
          secondaryAction={
            <Stack direction="row" gap={0.5} alignItems="center">
              <Typography variant="body3" color="text.secondary">
                {contacts.length}
              </Typography>
              <ChevronRightIcon
                size={20}
                color={theme.palette.text.secondary}
              />
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
          onClick={() => capture('ReportBugClicked')}
        />
        <SettingsNavItem
          label={t('Request a feature')}
          href={CORE_FEATURE_REQUEST_URL}
          divider
          onClick={() => capture('ProductFeatureRequestClicked')}
        />
        <SettingsNavItem
          label={t('Send feedback')}
          href={CORE_FEEDBACK_URL}
          divider
          onClick={() => capture('ProductFeedbackClicked')}
        />
        <SettingsNavItem
          label={t('Help center')}
          sx={{ py: 0, mt: 0.75 }}
          href={CORE_SUPPORT_URL}
          onClick={() => capture('HelpCenterClicked')}
        />
      </SettingsCard>
      <Button
        size="small"
        sx={{ minWidth: '120px' }}
        variant="contained"
        color="secondary"
        onClick={lockWallet}
      >
        {t('Lock Core')}
      </Button>
      <Footer mt={4} />
      {isDeveloperMode && (
        <TestnetModeOverlay
          verticalLines={[12, -12]}
          horizontalLines={[102, 126, 140]}
        />
      )}
    </Page>
  );
};
