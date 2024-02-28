import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps, SettingsPages } from '../models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Logo } from '@src/components/icons/Logo';
import { BrandName } from '@src/components/icons/BrandName';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@src/hooks/useLanguages';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { getCoreWebUrl } from '@src/utils/getCoreWebUrl';
import {
  Button,
  IconButton,
  Stack,
  XIcon,
  Typography,
  ChevronRightIcon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  UserIcon,
  GearIcon,
  LockIcon,
  GlobeIcon,
  LedgerIcon,
  CurrencyIcon,
  Chip,
  ComputerIcon,
  Badge,
} from '@avalabs/k2-components';
import browser from 'webextension-polyfill';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

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
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();

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
          <Logo height={29} />
          <BrandName height={17} margin="0 0 0 8px" />
          <Stack sx={{ width: 'auto', ml: 2 }}>
            <BetaLabel />
          </Stack>
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
              window.open(
                getCoreWebUrl(activeAccount?.addressC),
                '_blank',
                'noreferrer'
              );
            }}
          >
            <ListItemIcon>
              <ComputerIcon size={24} />
            </ListItemIcon>
            <ListItemText
              sx={{ ml: 1, my: 0, color: 'secondary.main' }}
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
                    SettingsPages.SECURITY_AND_PRIVACY
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
                'noreferrer'
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
