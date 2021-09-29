import React from 'react';
import { Modal } from '@src/components/common/Modal';
import {
  PrimaryButton,
  SecondaryCard,
  SubTextTypography,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';

export function SendConfirmation({
  isOpen,
  txId,
  onClose,
}: {
  isOpen: boolean;
  txId: string;
  onClose(): void;
}) {
  return (
    <Modal isOpen={isOpen}>
      <VerticalFlex width={'100%'} align={'center'} justify={'center'}>
        <Typography size={18}>Congratulations</Typography>
        <br />
        <Typography size={14}>Your transaction is complete.</Typography>
        <br />
        <SecondaryCard>
          <VerticalFlex>
            <SubTextTypography margin={'0 0 10px 0'}>
              Transaction Hash
            </SubTextTypography>
            <Typography style={{ wordBreak: 'break-word' }}>{txId}</Typography>
          </VerticalFlex>
        </SecondaryCard>
        <TextButton>view transaction in explorer</TextButton>
        <br />
        <br />
        <br />
        <br />
        <PrimaryButton onClick={() => onClose && onClose()}>
          Close
        </PrimaryButton>
      </VerticalFlex>
    </Modal>
  );
}
