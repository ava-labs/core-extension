import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletType } from '@src/background/services/wallet/models';
import { ResetExtensionStateHandler } from '@src/background/services/storage/handlers/resetExtensionState';
import { Trans, useTranslation } from 'react-i18next';
import {
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
  Typography,
} from '@avalabs/k2-components';
import { useState } from 'react';
import Dialog from '@src/components/common/Dialog';

export function SecurityAndPrivacy({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { analyticsConsent, setAnalyticsConsent } = useSettingsContext();
  const { capture, stopDataCollection, initAnalyticsIds } =
    useAnalyticsContext();
  const { request } = useConnectionContext();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
        {walletDetails?.type === WalletType.MNEMONIC && (
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
                {t('Show Recovery')}
              </ListItemText>

              <ListItemIcon>
                <ChevronRightIcon size={24} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
        <ListItem data-testid="participate-core-analytics-menu-item">
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            {t('Participate in Core Analytics')}
          </ListItemText>
          <Switch
            size="small"
            checked={analyticsConsent}
            onChange={async () => {
              const newConsent = !analyticsConsent;

              if (!newConsent) {
                await capture('AnalyticsDisabled');
                stopDataCollection();
                setAnalyticsConsent(newConsent);
              } else {
                await setAnalyticsConsent(newConsent);
                await initAnalyticsIds(true);
                // sends an ANALYTICS_CAPTURE_EVENT request without waiting for state updates
                capture('AnalyticsEnabled', undefined, true);
              }
            }}
          />
        </ListItem>
      </List>

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
    </Stack>
  );
}
