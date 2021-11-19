import React from 'react';
import {
  LoadingSpinnerIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { Modal } from '@src/components/common/Modal';

export function TransactionInProgress({ isOpen }: { isOpen: boolean }) {
  const theme = useTheme();
  return (
    <Modal isOpen={isOpen}>
      <VerticalFlex
        padding="40px 16px 16px"
        height={'100%'}
        width={'100%'}
        align={'center'}
      >
        <Typography size={24} height="29px" weight={700}>
          Transaction in progress
        </Typography>
        <VerticalFlex grow="1" align="center" justify="center">
          <LoadingSpinnerIcon height={'52px'} color={theme.colors.primary1} />
        </VerticalFlex>
      </VerticalFlex>
    </Modal>
  );
}
