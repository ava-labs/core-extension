import React from 'react';
import { Modal } from '@src/components/common/Modal';
import {
  LoadingIcon,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 212px;
  height: 212px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg3};
  justify-content: center;
  align-items: center;
`;

export function SendInProgress({ isOpen }: { isOpen: boolean }) {
  const theme = useTheme();
  return (
    <Modal isOpen={isOpen}>
      <VerticalFlex
        padding="36px"
        height={'100%'}
        width={'100%'}
        align={'center'}
        justify={'center'}
      >
        <IllustrationPlaceholder>
          <SubTextTypography>Illustration</SubTextTypography>
        </IllustrationPlaceholder>
        <Typography margin="40px 0 24px" size={24} height="29px" weight={700}>
          Transaction in Progress
        </Typography>
        <LoadingIcon height={'12px'} color={theme.colors.primary1} />
      </VerticalFlex>
    </Modal>
  );
}
