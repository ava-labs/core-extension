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
  PrimaryIconButton,
} from '@avalabs/react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { TokenImg } from '@src/components/common/TokenImage';
import { ERC20 } from '@avalabs/wallet-react-components';

export function SendErc20Confirm({
  open,
  onClose,
  onConfirm,
  amount,
  amountUsd,
  address,
  fee,
  token,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  amount: BN;
  amountUsd: string;
  address: string;
  fee: number;
  token: ERC20;
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
          <TokenImg src={token.logoURI} />
          <SubTextTypography margin={'10px 0 0 0'}>
            Payment amount
          </SubTextTypography>
          <Typography>
            {amount} {token.symbol}
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
