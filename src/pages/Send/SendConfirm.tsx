import React, { useEffect, useState } from 'react';
import { Modal } from '@src/components/common/Modal';
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
import { DestinationChainTx } from '@avalabs/wallet-react-components';
import { SendInProgress } from './SendInProgress';
import { SendConfirmation } from './SendConfirmation';
import { SendConsolidationDetails } from './SendConsolidationDetails';
import styled, { useTheme } from 'styled-components';
import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';

interface SendConfirmProps {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  amount: string;
  amountUsd: string;
  extraTxs: DestinationChainTx[];
  address: string;
  fee: string;
  txId?: string;
  chain?: ChainIdType;
}

const DataCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.bg3};
`;

export function SendConfirm({
  open,
  onClose,
  onConfirm,
  amount,
  amountUsd,
  extraTxs,
  address,
  fee,
  txId,
  chain,
}: SendConfirmProps) {
  const theme = useTheme();
  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [showTxConfirmed, setShowTxConfirmed] = useState(false);
  const [showTxDetails, setShowTxDetails] = useState(false);

  const onBackClick = () => {
    if (showTxDetails) {
      setShowTxDetails(false);
    } else {
      onClose && onClose();
    }
  };

  useEffect(() => {
    if (txId) {
      setShowTxInProgress(false);
      setShowTxConfirmed(true);
    }
  }, [txId]);

  if (showTxInProgress) {
    return <SendInProgress isOpen={true} />;
  }

  if (showTxConfirmed && txId) {
    return (
      <SendConfirmation
        onClose={() => {
          onClose();
          setShowTxConfirmed(false);
        }}
        isOpen={true}
        txId={txId}
        chain={chain}
      />
    );
  }

  return (
    <Modal isOpen={open}>
      <VerticalFlex padding="36px" height="100%">
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
            <Typography as={'h1'} size={24} weight={700}>
              {showTxDetails ? 'Additional fees' : 'Confirm transaction'}
            </Typography>
          </HorizontalFlex>
        </HorizontalFlex>
        <VerticalFlex margin="32px 0 0 0" align={'center'}>
          <AvaxTokenIcon />
          <SubTextTypography margin={'8px 0 0 0'} height="24px">
            Payment amount
          </SubTextTypography>
          <Typography margin={'8px 0'} size={24} weight={700} height="29px">
            {amount || 0} AVAX
          </Typography>
          <SubTextTypography size={16} weight={600} height="24px">
            {amountUsd} USD
          </SubTextTypography>
        </VerticalFlex>

        {showTxDetails ? (
          <DataCard margin="24px 0" height="300px" padding="24px 0">
            <SendConsolidationDetails txs={extraTxs} />
          </DataCard>
        ) : (
          <>
            <DataCard margin="24px 0" padding="16px">
              <VerticalFlex>
                <SubTextTypography margin={'0 0 8px 0'}>
                  Send to
                </SubTextTypography>
                <Typography height="17px" size={14} wordBreak="break-all">
                  {address}
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
                  <SubTextTypography margin={'0 0 8px 0'}>
                    Transaction fee
                  </SubTextTypography>
                  <Typography size={14}>{fee || 0} AVAX</Typography>
                </VerticalFlex>
                {extraTxs?.length ? (
                  <TextButton onClick={() => setShowTxDetails(!showTxDetails)}>
                    View Details
                  </TextButton>
                ) : null}
              </HorizontalFlex>
            </DataCard>
          </>
        )}
        <HorizontalFlex width="100%" grow="1" justify="center" align="flex-end">
          <PrimaryButton
            size={ComponentSize.LARGE}
            onClick={() => {
              setShowTxInProgress(true);
              onConfirm && onConfirm();
            }}
          >
            Confirm
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </Modal>
  );
}
