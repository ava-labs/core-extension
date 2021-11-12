import React, { useEffect, useState } from 'react';
import {
  CaretIcon,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
  PrimaryButton,
  IconDirection,
  Card,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import {
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { SendConfirmation } from './SendConfirmation';
import { SendConsolidationDetails } from './SendConsolidationDetails';
import styled, { useTheme } from 'styled-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useSend } from './hooks/useSend';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';

interface SendConfirmProps {
  onClose(): void;
  onConfirm(): void;
  sendState: ReturnType<typeof useSend>;
  token: TokenWithBalance;
  fee: string;
}

const DataCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.bg3};
`;

export function SendConfirm({
  onClose,
  onConfirm,
  sendState,
  token,
  fee,
}: SendConfirmProps) {
  const theme = useTheme();
  const { currencyFormatter } = useSettingsContext();
  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [showTxConfirmed, setShowTxConfirmed] = useState(false);
  const [showTxDetails, setShowTxDetails] = useState(false);

  const onBackClick = () => {
    if (showTxDetails) {
      setShowTxDetails(false);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (sendState?.txId) {
      setShowTxInProgress(false);
      setShowTxConfirmed(true);
    }
  }, [sendState?.txId]);

  if (showTxConfirmed && sendState?.txId) {
    return (
      <SendConfirmation
        onClose={() => {
          onClose();
          setShowTxConfirmed(false);
        }}
        txId={sendState?.txId}
        chain={sendState?.targetChain}
      />
    );
  }

  const amount = Utils.bnToLocaleString(
    sendState?.amount || new BN(0),
    token.denomination
  );

  const amountInCurrency = currencyFormatter(
    Number(amount || 0) * (token?.priceUSD ?? 0)
  );

  return (
    <>
      {showTxInProgress && <LoadingOverlay />}
      <HorizontalFlex align={'center'} justify="center" width="100%">
        <TextButton onClick={() => onBackClick()}>
          <CaretIcon
            color={theme.colors.text1}
            direction={IconDirection.LEFT}
          />
        </TextButton>
        <HorizontalFlex
          grow="1"
          align="center"
          justify="center"
          padding="0 24px 0 0"
        >
          <Typography as={'h1'} size={18} height="22px" weight={700}>
            {showTxDetails ? 'Additional Fees' : 'Confirm Transaction'}
          </Typography>
        </HorizontalFlex>
      </HorizontalFlex>

      {showTxDetails ? (
        <VerticalFlex margin="40px 0 0" grow="1">
          <SendConsolidationDetails txs={sendState?.txs || []} />
          <PrimaryButton
            size={ComponentSize.LARGE}
            onClick={() => {
              onBackClick();
            }}
          >
            Got it
          </PrimaryButton>
        </VerticalFlex>
      ) : (
        <>
          <VerticalFlex margin="24px 0 0 0" align={'center'}>
            {isAvaxToken(token) ? (
              <AvaxTokenIcon height="31px" />
            ) : (
              <TokenIcon
                src={(token as TokenWithBalance).logoURI}
                height="31px"
                width="31px"
              />
            )}
            <SubTextTypography margin={'8px 0 0 0'} height="17px" size={14}>
              Payment amount
            </SubTextTypography>
            <Typography margin={'8px 0'} size={24} weight={700} height="29px">
              {amount} {token.symbol}
            </Typography>
            <SubTextTypography weight={600} height="24px">
              {token?.priceUSD ? `~${amountInCurrency} USD` : ''}
            </SubTextTypography>
          </VerticalFlex>
          <DataCard margin="24px 0 16px" padding="16px">
            <VerticalFlex>
              <SubTextTypography margin={'0 0 8px 0'} height="17px">
                Send to
              </SubTextTypography>
              <Typography height="24px" wordBreak="break-all">
                {sendState?.address}
              </Typography>
            </VerticalFlex>
          </DataCard>
          <DataCard padding="16px">
            <HorizontalFlex
              justify={'space-between'}
              align={'center'}
              width={'100%'}
            >
              <VerticalFlex>
                <SubTextTypography margin={'0 0 8px 0'} height="17px">
                  Transaction fee
                </SubTextTypography>
                <Typography height="24px">{fee || 0} AVAX</Typography>
              </VerticalFlex>
              {sendState?.txs?.length ? (
                <TextButton onClick={() => setShowTxDetails(!showTxDetails)}>
                  View Details
                </TextButton>
              ) : null}
            </HorizontalFlex>
          </DataCard>
          <HorizontalFlex
            width="100%"
            grow="1"
            justify="center"
            align="flex-end"
          >
            <PrimaryButton
              size={ComponentSize.LARGE}
              onClick={() => {
                setShowTxInProgress(true);
                onConfirm();
              }}
            >
              Confirm
            </PrimaryButton>
          </HorizontalFlex>
        </>
      )}
    </>
  );
}