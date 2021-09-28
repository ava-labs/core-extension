import React from 'react';
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
  TextButton,
  PrimaryIconButton,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { DestinationChainTx } from '@avalabs/wallet-react-components';

export function SendAntConfirm({
  open,
  onClose,
  onConfirm,
  amount,
  amountUsd,
  extraTxs,
  address,
  fee,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  amount: string;
  amountUsd: string;
  extraTxs: DestinationChainTx[];
  address: string;
  fee: string;
}) {
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
          <AvaxTokenIcon />
          <SubTextTypography margin={'10px 0 0 0'}>
            Payment amount
          </SubTextTypography>
          <Typography>{amount || 0} AVAX</Typography>
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
            {extraTxs?.length ? <TextButton>View Details</TextButton> : ''}
          </HorizontalFlex>
        </SecondaryCard>
        <br />
        <HorizontalFlex width={'100%'} justify={'center'}>
          <PrimaryButton onClick={() => onConfirm && onConfirm()}>
            Confirm
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </Modal>
  );
}
