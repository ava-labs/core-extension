import Dialog from '@/components/common/Dialog';
import { SettingsPages, useAnalyticsContext } from '@core/ui';
import { useConnectionContext } from '@core/ui';
import { useFeatureFlagContext } from '@core/ui';
import { useSeedlessMfaManager } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { useWalletContext } from '@core/ui';
import { useAnalyticsConsentCallbacks } from '@core/ui';
import {
  Badge,
  Button,
  ChevronRightIcon,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { ResetExtensionStateHandler } from '@core/service-worker';
import {
  AnalyticsConsent,
  ExtensionRequest,
  FeatureGates,
  SecretType,
  SeedlessExportAnalytics,
} from '@core/types';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function SecurityAndPrivacy({
  goBack,
  navigateTo,
  width,
  showNotificationDotOn = [],
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { isMfaSetupPromptVisible } = useSeedlessMfaManager();
  const { analyticsConsent } = useSettingsContext();
  const { onApproval, onRejection } = useAnalyticsConsentCallbacks('settings');
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { request } = useConnectionContext();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { featureFlags } = useFeatureFlagContext();
  const areMfaSettingsAvailable =
    featureFlags[FeatureGates.SEEEDLESS_MFA_SETTINGS];

  const logoutDialogContent = (
    <Stack sx={{ justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        <Trans i18nKey="Have you recorded your<br /> recovery phrase?" />
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        {t('Without it you will not be able to sign back in to your account.')}
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{ mb: 1 }}
          onClick={async () => {
            await capture('RecoveryPhraseResetApproved');
            await stopDataCollection();
            request<ResetExtensionStateHandler>({
              method: ExtensionRequest.RESET_EXTENSION_STATE,
              params: [true],
            });
            setShowLogoutDialog(false);
          }}
        >
          {t('Yes')}
        </Button>
        <Button
          variant="text"
          onClick={() => {
            capture('RecoveryPhraseResetDeclined');
            setShowLogoutDialog(false);
          }}
        >
          {t('No')}
        </Button>
      </Stack>
    </Stack>
  );

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
        title={t('Security & Privacy')}
      />

      <List sx={{ mb: 2 }}>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              justifyContent: 'space-between',
              py: 1,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            data-testid="connected-sites-menu-item"
            onClick={() => {
              capture('ConnectedSitesClicked');
              navigateTo(SettingsPages.CONNECTED_SITES);
            }}
          >
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
              {t('Connected Sites')}
            </ListItemText>

            <ListItemIcon>
              <ChevronRightIcon size={24} />
            </ListItemIcon>
          </ListItemButton>
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
            data-testid="change-password-menu-item"
            onClick={() => {
              capture('ChangePasswordClicked');
              navigateTo(SettingsPages.CHANGE_PASSWORD);
            }}
          >
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
              {t('Change Password')}
            </ListItemText>

            <ListItemIcon>
              <ChevronRightIcon size={24} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {walletDetails?.type === SecretType.Seedless &&
          areMfaSettingsAvailable && (
            <ListItem sx={{ p: 0 }}>
              <ListItemButton
                sx={{
                  justifyContent: 'space-between',
                  py: 1,
                  px: 2,
                  m: 0,
                  '&:hover': { borderRadius: 0 },
                }}
                data-testid="recovery-methods"
                onClick={() => {
                  capture('RecoveryMethodsClicked');
                  navigateTo(SettingsPages.RECOVERY_METHODS);
                }}
              >
                <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                  {t('Recovery Methods')}
                </ListItemText>

                <ListItemIcon>
                  <ChevronRightIcon size={24} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
        {walletDetails?.type === SecretType.Mnemonic && (
          <ListItem sx={{ p: 0 }}>
            <ListItemButton
              sx={{
                justifyContent: 'space-between',
                py: 1,
                px: 2,
                m: 0,
                '&:hover': { borderRadius: 0 },
              }}
              data-testid="show-recovery-phrase-menu-item"
              onClick={() => navigateTo(SettingsPages.RECOVERY_PHRASE)}
            >
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {t('Show Recovery Phrase')}
              </ListItemText>

              <ListItemIcon>
                <ChevronRightIcon size={24} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
        {walletDetails?.type === SecretType.Seedless && (
          <ListItem sx={{ p: 0 }}>
            <Tooltip
              sx={{
                justifyContent: 'space-between',
                width: 1,
                cursor: 'not-allowed',
              }}
              title={
                isMfaSetupPromptVisible
                  ? t('Please configure multi-factor authentication first.')
                  : ''
              }
            >
              <ListItemButton
                sx={{
                  justifyContent: 'space-between',
                  py: 1,
                  px: 2,
                  m: 0,
                  '&:hover': { borderRadius: 0 },
                }}
                data-testid="seedless-export-recovery-phrase-menu-item"
                onClick={() => {
                  capture(SeedlessExportAnalytics.MenuItemClicked);
                  navigateTo(SettingsPages.EXPORT_RECOVERY_PHRASE);
                }}
                disabled={isMfaSetupPromptVisible}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={
                    !showNotificationDotOn.includes(
                      SettingsPages.EXPORT_RECOVERY_PHRASE,
                    )
                  }
                >
                  <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                    {t('Export Recovery Phrase')}
                  </ListItemText>
                </Badge>

                <ListItemIcon>
                  <ChevronRightIcon size={24} />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
        <ListItem data-testid="participate-core-analytics-menu-item">
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            {t('Participate in Core Analytics')}
          </ListItemText>
          <Switch
            size="small"
            checked={analyticsConsent === AnalyticsConsent.Approved}
            onChange={async (ev) => {
              const newConsent = ev.target.checked;

              if (newConsent) {
                onApproval();
              } else {
                onRejection();
              }
            }}
          />
        </ListItem>
      </List>

      {walletDetails?.type !== SecretType.Seedless && (
        <>
          <Divider />

          <Stack
            sx={{
              mt: 3,
              px: 2,
            }}
          >
            <Button
              variant="text"
              color="error"
              size="medium"
              data-testid="reset-recovery-phrase-menu-item"
              onClick={() => {
                capture('RecoveryPhraseResetClicked');
                setShowLogoutDialog(true);
              }}
            >
              {t('Reset Secret Recovery Phrase')}
            </Button>
          </Stack>
          <Dialog
            open={showLogoutDialog}
            onClose={() => setShowLogoutDialog(false)}
            content={logoutDialogContent}
            bgColorDefault
          />
        </>
      )}
    </Stack>
  );
}
