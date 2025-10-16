import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  styled,
  Box,
  Divider,
  Scrollbars,
  ChevronRightIcon,
} from '@avalabs/core-k2-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import {
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
  useWalletContext,
} from '@core/ui';
import { Trans, useTranslation } from 'react-i18next';
import { ConnectionIndicatorK2 } from '../../common/ConnectionIndicatorK2';
import browser from 'webextension-polyfill';

const StyledListNumber = styled(Box)`
  background-color: ${({ theme }) => theme.palette.grey[800]};
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  padding-left: 6px; // optically center the number because of the period
`;

const InstructionLink = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export function Ledger({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { hasLedgerTransport, avaxAppVersion } = useLedgerContext();
  const { walletDetails } = useWalletContext();
  console.log('walletDetails: ', walletDetails);

  return (
    <Stack
      width={width}
      sx={{ height: '100%', backgroundColor: 'background.paper' }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Ledger')}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <List>
          <ListItem sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2">{t('Status')}</Typography>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <ConnectionIndicatorK2 connected={hasLedgerTransport} size={12} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {hasLedgerTransport ? t('Connected') : t('Disconnected')}
              </Typography>
            </Stack>
          </ListItem>
          {hasLedgerTransport && (
            <>
              <ListItem sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2">{t('Ledger Version')}</Typography>
                <Typography variant="body2">{avaxAppVersion}</Typography>
              </ListItem>
              <ListItem sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2">{t('Derivation Path')}</Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    browser.tabs.create({
                      url: `/fullscreen.html#/accounts/add-wallet/ledger?walletId=${walletDetails?.id}&derivationPath=${walletDetails?.derivationPath}`,
                    })
                  }
                >
                  {t('Edit')} <ChevronRightIcon size={12} />
                </Typography>
              </ListItem>
            </>
          )}
        </List>
        {!hasLedgerTransport && (
          <Stack sx={{ width: '100%', py: 0, px: 2 }}>
            <Typography variant="body2">{t('To Connect:')}</Typography>
            <List sx={{ pt: 1.5, mb: 1 }}>
              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <StyledListNumber>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'fontWeightSemibold' }}
                  >
                    {t('1.')}
                  </Typography>
                </StyledListNumber>
                <ListItemText sx={{ m: 0 }}>
                  <Typography variant="body1">
                    {t('Connect the Ledger device to your computer.')}
                  </Typography>
                </ListItemText>
              </ListItem>

              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <StyledListNumber>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'fontWeightSemibold' }}
                  >
                    {t('2.')}
                  </Typography>
                </StyledListNumber>
                <ListItemText sx={{ m: 0 }}>
                  <Typography variant="body1">
                    {t('Enter your PIN and access your device.')}
                  </Typography>
                </ListItemText>
              </ListItem>

              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <StyledListNumber>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'fontWeightSemibold' }}
                  >
                    {t('3.')}
                  </Typography>
                </StyledListNumber>
                <ListItemText sx={{ m: 0 }}>
                  <Typography variant="body1">
                    <Trans
                      i18nKey="Ensure you have installed the <strong>Avalanche App v{{REQUIRED_LEDGER_VERSION}}</strong> (or above) and open it on your device."
                      values={{
                        REQUIRED_LEDGER_VERSION: REQUIRED_LEDGER_VERSION,
                      }}
                    />
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>

            <Divider />

            <Typography
              variant="body2"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              {t(
                'If you do not have the Avalanche app on your Ledger, please add it through the Ledger Live app manager.',
              )}
            </Typography>
            <Typography variant="body2">
              <Trans
                i18nKey="More instructions can be found <instructionLink>here</instructionLink>."
                components={{
                  instructionLink: (
                    <InstructionLink
                      as="a"
                      target="_blank"
                      href="https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true"
                      rel="noreferrer"
                    />
                  ),
                }}
              />
            </Typography>
          </Stack>
        )}
      </Scrollbars>
    </Stack>
  );
}
