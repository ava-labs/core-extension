import React from 'react';
import { Modal } from '@src/components/common/Modal';
import {
  PrimaryButton,
  SubTextTypography,
  TextButton,
  Typography,
  VerticalFlex,
  LinkIcon,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { useExplorerUrl } from '@src/hooks/useExplorerUrl';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 212px;
  height: 212px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg3};
  justify-content: center;
  align-items: center;
`;

const StyledLinkIcon = styled(LinkIcon)`
  margin: 0 8px 0 0;
`;

export function SendConfirmation({
  isOpen,
  txId,
  chain,
  onClose,
}: {
  isOpen: boolean;
  txId: string;
  chain?: ChainIdType;
  onClose(): void;
}) {
  const theme = useTheme();
  const explorerUrl = useExplorerUrl(txId, chain);
  return (
    <Modal isOpen={isOpen}>
      <VerticalFlex
        padding="36px"
        width="100%"
        height="100%"
        align={'center'}
        justify={'flex-end'}
      >
        <IllustrationPlaceholder>
          <SubTextTypography>Illustration</SubTextTypography>
        </IllustrationPlaceholder>
        <Typography size={24} weight={700} margin="40px 0 56px">
          Asset Sent
        </Typography>
        {explorerUrl && (
          <TextButton
            as="a"
            href={explorerUrl}
            target="_blank"
            margin="0 0 36px"
          >
            <StyledLinkIcon color={theme.colors.primary1} />
            View on Explorer
          </TextButton>
        )}
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => onClose && onClose()}
        >
          Done
        </PrimaryButton>
      </VerticalFlex>
    </Modal>
  );
}
