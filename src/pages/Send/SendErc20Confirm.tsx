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
  SecondaryCard,
  PrimaryIconButton,
  TextButton,
} from '@avalabs/react-components';
import { TokenImg } from '@src/components/common/TokenImage';
import { DestinationChainTx, ERC20 } from '@avalabs/wallet-react-components';
import { SendInProgress } from './SendInProgress';
import { SendConfirmation } from './SendConfirmation';
import { SendConsolidationDetails } from './sendConsolidationDetails';

export function SendErc20Confirm({
  open,
  onClose,
  onConfirm,
  amount,
  amountUsd,
  address,
  fee,
  token,
  txId,
  extraTxs,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  amount: string;
  amountUsd: string;
  address: string;
  fee: string;
  token: ERC20;
  txId?: string;
  extraTxs: DestinationChainTx[];
}) {
  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [showTxConfirmed, setShowTxConfirmed] = useState(false);
  const [showTxDetails, setShowTxDetails] = useState(false);

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
      />
    );
  }

  return (
    <Modal isOpen={open}>
      <VerticalFlex>
        <HorizontalFlex align={'center'}>
          <PrimaryIconButton onClick={() => onClose && onClose()}>
            <CaretIcon direction={IconDirection.LEFT} />
          </PrimaryIconButton>
          <Typography as={'h1'} size={24} weight={700} margin={'0 0 0 60px'}>
            Confirm transaction
          </Typography>
        </HorizontalFlex>
        <br />
        <br />
        <VerticalFlex align={'center'} style={{ lineHeight: '24px' }}>
          <TokenImg src={token.logoURI} />
          <SubTextTypography margin={'10px 0 0 0'}>
            Payment amount
          </SubTextTypography>
          <Typography>
            {amount || 0} {token.symbol}
          </Typography>
          <SubTextTypography>${amountUsd} USD</SubTextTypography>
        </VerticalFlex>
        <br />
        <SecondaryCard>
          <VerticalFlex>
            <SubTextTypography margin={'0 0 10px 0'}>Send to</SubTextTypography>
            <Typography style={{ wordBreak: 'break-word' }}>
              {address}
            </Typography>
          </VerticalFlex>
        </SecondaryCard>
        <br />
        <SecondaryCard>
          <HorizontalFlex
            justify={'space-between'}
            align={'center'}
            width={'100%'}
          >
            <VerticalFlex>
              <SubTextTypography margin={'0 0 10px 0'}>
                Transaction fee
              </SubTextTypography>
              <Typography>{fee} AVAX</Typography>
            </VerticalFlex>
            {extraTxs?.length ? (
              <TextButton onClick={() => setShowTxDetails(!showTxDetails)}>
                View Details
              </TextButton>
            ) : (
              ''
            )}
          </HorizontalFlex>
        </SecondaryCard>
        {showTxDetails ? (
          <SecondaryCard>
            <SendConsolidationDetails txs={extraTxs} />
          </SecondaryCard>
        ) : (
          ''
        )}
        <br />
        <HorizontalFlex width={'100%'} justify={'center'}>
          <PrimaryButton
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
