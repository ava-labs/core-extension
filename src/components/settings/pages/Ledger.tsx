import {
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryDropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import {
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@src/contexts/LedgerProvider';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

const StyledNumberList = styled(Typography)`
  font-size: 14px;
  display: block;
  background-color: ${({ theme }) => theme.colors.bg3};
  height: 24px;
  width: 24px;
  min-width: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  padding: 0 6px;
  margin-right: 16px;
`;

export function Ledger({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { hasLedgerTransport } = useLedgerContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Ledger')}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <SecondaryDropDownMenuItem
          selected={hasLedgerTransport}
          justify="space-between"
          align="center"
          padding="10px 16px"
          margin="16px 0 0"
          background={theme.colors.bg3}
        >
          <Typography size={14} height="17px">
            {t('Status')}
          </Typography>
          <HorizontalFlex align="center">
            <ConnectionIndicator
              connected={hasLedgerTransport}
              disableTooltip
              size={8}
            />
            <Typography
              size={14}
              height="17px"
              color={theme.colors.text2}
              margin="0 0 0 8px"
            >
              {hasLedgerTransport ? t('Connected') : t('Disconnected')}
            </Typography>
          </HorizontalFlex>
        </SecondaryDropDownMenuItem>
        {!hasLedgerTransport && (
          <VerticalFlex width="100%" padding="0 16px">
            <Typography
              padding="10px 0"
              margin="0 0 16px"
              size={14}
              height="17px"
            >
              {t('To Connect:')}
            </Typography>
            <HorizontalFlex>
              <StyledNumberList>{t('1.')}</StyledNumberList>
              <Typography size={14} height="17px" margin="0 0 24px 0">
                {t('Connect the Ledger device to your computer.')}
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex>
              <StyledNumberList>{t('2.')}</StyledNumberList>
              <Typography size={14} height="17px" margin="0 0 24px 0">
                {t('Enter your PIN and access your device.')}
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex>
              <StyledNumberList>{t('3.')}</StyledNumberList>
              <Typography size={14} height="17px">
                <Trans
                  i18nKey="Ensure you have installed the <strong>Avalanche App v{{REQUIRED_LEDGER_VERSION}}</strong> (or above) and open it on your device."
                  REQUIRED_LEDGER_VERSION={REQUIRED_LEDGER_VERSION}
                />
              </Typography>
            </HorizontalFlex>

            <HorizontalSeparator margin="24px 0" />

            <Typography size={14} height="17px">
              <Trans i18nKey="If you do not have the Avalanche app on your Ledger, please add it through the Ledger Live app manager. More instructions can be found here." />
            </Typography>
          </VerticalFlex>
        )}
      </Scrollbars>
    </VerticalFlex>
  );
}
