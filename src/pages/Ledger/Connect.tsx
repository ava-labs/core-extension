import {
  Card,
  ComponentSize,
  ConnectionIndicator,
  HorizontalFlex,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useAppTypeFromParams } from './hooks/useAppTypeFromParams';
import { Trans, useTranslation } from 'react-i18next';

export function LedgerConnect() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hasLedgerTransport, appType, popDeviceSelection } =
    useLedgerContext();
  const requiredAppType = useAppTypeFromParams();

  useEffect(() => {
    popDeviceSelection();
    // Do this exactly once, all retries should be initiated by the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectedWithCorrectApp =
    hasLedgerTransport && appType === requiredAppType;

  return (
    <VerticalFlex height="100%" padding="0 16px">
      <Typography margin="12px" weight={700} height="29px" size={24}>
        {t('Ledger Status')}
      </Typography>

      <Card padding="16px" margin="8px 0">
        <VerticalFlex grow="1">
          <HorizontalFlex width="100%" justify="space-between" align="center">
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
          </HorizontalFlex>
          {hasLedgerTransport && (
            <HorizontalFlex
              width="100%"
              marginTop="16px"
              justify="space-between"
              align="center"
            >
              <Typography size={14} height="17px">
                {t('Application')}
              </Typography>
              <Typography
                size={14}
                height="17px"
                color={theme.colors.text2}
                margin="0 0 0 8px"
              >
                {appType}
              </Typography>
            </HorizontalFlex>
          )}
        </VerticalFlex>
      </Card>
      <Card margin="24px 0 0" padding="16px">
        <VerticalFlex>
          {connectedWithCorrectApp ? (
            <VerticalFlex width="100%">
              <Typography
                padding="10px 0"
                margin="0 0 16px"
                size={14}
                height="17px"
                weight={600}
              >
                {t('To Continue:')}
              </Typography>
              <HorizontalFlex>
                <StyledNumberList>{t('1.')}</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  {t('Click close below.')}
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>{t('2.')}</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  {t('Open Core in your browser.')}
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>{t('3.')}</StyledNumberList>
                <Typography size={14} height="17px">
                  {t('Reenter the transaction details and try again.')}
                </Typography>
              </HorizontalFlex>
            </VerticalFlex>
          ) : (
            <VerticalFlex width="100%">
              <Typography
                padding="10px 0"
                margin="0 0 16px"
                size={14}
                height="17px"
                weight={600}
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
                    i18nKey="Ensure you have installed the latest <typography>{{requiredAppType}} App</typography> and open it on your device."
                    requiredAppType={requiredAppType}
                    components={{
                      typography: (
                        <Typography weight={600} size={14} height="inherit" />
                      ),
                    }}
                  />
                </Typography>
              </HorizontalFlex>

              <Typography size={14} height="17px" margin="24px 0 0 ">
                {
                  (t(
                    'If you do not have the {{requiredAppType}} App on your Ledger, please add it through the Ledger Live app manager.'
                  ),
                  { requiredAppType })
                }
              </Typography>
            </VerticalFlex>
          )}
        </VerticalFlex>
      </Card>
      <VerticalFlex grow="1" justify="flex-end">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => {
            if (connectedWithCorrectApp) {
              window.close();
            } else {
              popDeviceSelection();
            }
          }}
          width="100%"
        >
          {connectedWithCorrectApp ? t('Close') : t('Retry')}
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
