import { BrandName } from '@/components/icons/BrandName';
import {
  Badge,
  Box,
  Button,
  ChevronRightIcon,
  Chip,
  ComputerIcon,
  CurrencyIcon,
  Divider,
  GearIcon,
  GlobeIcon,
  IconButton,
  LedgerIcon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  LockIcon,
  Stack,
  Typography,
  UserIcon,
  XIcon,
} from '@avalabs/core-k2-components';
import { getCoreWebPortfolioUrl } from '@core/common';
import {
  SettingsPages,
  useAnalyticsContext,
  useLanguage,
  useSeedlessMfaManager,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';
import { SettingsPageProps } from '../models';

export function MainPage({
  navigateTo,
  width,
  onClose,
  showNotificationDotOn = [],
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { isLedgerWallet } = useWalletContext();
  const { lockWallet } = useSettingsContext();
  const { currentLanguage } = useLanguage();
  const { capture } = useAnalyticsContext();
  const { isMfaSetupPromptVisible } = useSeedlessMfaManager();

  const extensionVersion = browser.runtime.getManifest().version;

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
        pt: 2,
        px: 0,
        py: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack
        sx={{
          mt: 0,
          mx: 0,
          mb: 2,
          py: 0,
          px: 2,
          flexDirection: 'row',
          height: '53px',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
      >
        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
          <BrandName width={90} />
        </Stack>
        <IconButton
          data-testid="close-settings-menu-button"
          onClick={onClose}
          disableRipple
        >
          <XIcon size={24} />
        </IconButton>
      </Stack>
      <List>
        {isMfaSetupPromptVisible && (
          <>
            <ListItem sx={{ p: 0 }}>
              <ListItemButton
                sx={{
                  justifyContent: 'space-between',
                  py: 1,
                  px: 2,
                  m: 0,
                  '&:hover': { borderRadius: 0 },
                }}
                data-testid="seedless-mfa-prompt-button"
                onClick={() => navigateTo(SettingsPages.RECOVERY_METHODS)}
              >
                <ListItemIcon sx={{ justifyContent: 'center', minWidth: 12 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'secondary.main',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{ ml: 1, my: 0 }}
                  primaryTypographyProps={{ variant: 'body2' }}
                >
                  {t('Finish Setting Up Recovery Methods')}
                </ListItemText>
                <ListItemIcon>
                  <ChevronRightIcon size={24} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        )}
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              justifyContent: 'space-between',
              py: 1,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            data-testid="core-web-link-button"
            onClick={() => {
              window.open(getCoreWebPortfolioUrl(), '_blank', 'noreferrer');
            }}
          >
            <ListItemIcon>
              <ComputerIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Core Web')}
            </ListItemText>

            <ListItemIcon>
              <Chip
                label={t('New!')}
                size="small"
                sx={{
                  backgroundColor: 'secondary.dark',
                  fontSize: '14px',
                }}
              />
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
            data-testid="address-book-option"
            onClick={() => navigateTo(SettingsPages.CONTACT_LIST)}
          >
            <ListItemIcon>
              <UserIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Address Book')}
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
            data-testid="currency-option"
            onClick={() => {
              capture('CurrencySettingClicked');
              navigateTo(SettingsPages.CURRENCIES);
            }}
          >
            <ListItemIcon>
              <CurrencyIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Currency')}
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
            data-testid="language-option"
            onClick={() => navigateTo(SettingsPages.LANGUAGE)}
          >
            <ListItemIcon>
              <GlobeIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Language')}
            </ListItemText>

            <ListItemIcon>
              <ChevronRightIcon size={24} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {isLedgerWallet && (
          <ListItem sx={{ p: 0 }}>
            <ListItemButton
              sx={{
                justifyContent: 'space-between',
                py: 1,
                px: 2,
                m: 0,
                '&:hover': { borderRadius: 0 },
              }}
              onClick={() => navigateTo(SettingsPages.LEDGER)}
            >
              <ListItemIcon>
                <LedgerIcon size={24} />
              </ListItemIcon>
              <ListItemText
                sx={{ ml: 1, my: 0 }}
                primaryTypographyProps={{ variant: 'body2' }}
              >
                {t('Ledger')}
              </ListItemText>
              <ListItemIcon>
                <ChevronRightIcon size={24} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              justifyContent: 'space-between',
              py: 1,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            data-testid="advanced-option"
            onClick={() => navigateTo(SettingsPages.ADVANCED)}
          >
            <ListItemIcon>
              <GearIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Advanced')}
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
            data-testid="security-privacy-option"
            onClick={() => navigateTo(SettingsPages.SECURITY_AND_PRIVACY)}
          >
            <ListItemIcon>
              <Badge
                color="secondary"
                variant="dot"
                invisible={
                  !showNotificationDotOn.includes(
                    SettingsPages.SECURITY_AND_PRIVACY,
                  )
                }
              >
                <LockIcon size={24} />
              </Badge>
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0 }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('Security & Privacy')}
            </ListItemText>
            <ListItemIcon>
              <ChevronRightIcon size={24} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <List dense>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={() => {
              navigateTo(SettingsPages.FEEDBACK);
            }}
            data-testid="feedback-option"
          >
            <ListItemText>
              <Typography variant="body2">{t('Send Feedback')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={() => {
              capture(`LegalClicked`);
              navigateTo(SettingsPages.LEGAL);
            }}
            data-testid="legal-option"
          >
            <ListItemText>
              <Typography variant="body2">{t('Legal')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={async () => {
              try {
                await capture(`HelpCenterClicked`);
              } catch (err) {
                console.error(err);
              }

              window.open(
                `https://support.avax.network/${
                  currentLanguage ? currentLanguage.linkCode : 'en'
                }/collections/3391518-core`,
                '_blank',
                'noreferrer',
              );
            }}
            data-testid="help-center-option"
          >
            <ListItemText>
              <Typography variant="body2">{t('Help Center')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >{`${t('Version')} ${extensionVersion}`}</Typography>
          </ListItemText>
        </ListItem>
      </List>
      <Stack
        sx={{
          height: '100%',
          flexDirection: 'column-reverse',
          px: 2,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={lockWallet}
          data-testid="lock-core-wallet-button"
        >
          {t('Lock Core')}
        </Button>
      </Stack>
    </Stack>
  );
}
