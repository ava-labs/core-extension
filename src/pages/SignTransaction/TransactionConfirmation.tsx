import React from 'react';
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
import { IllustrationPlaceholder } from '@src/components/common/IllustrationPlaceholder';
import { Modal } from '@src/components/common/Modal';

const StyledLinkIcon = styled(LinkIcon)`
  margin: 0 8px 0 0;
`;

export function TransactionConfirmation({
  txId,
  chain,
  onClose,
}: {
  txId: string;
  chain?: ChainIdType;
  onClose(): void;
}) {
  const theme = useTheme();
  const explorerUrl = useExplorerUrl(txId, chain);
  return (
    <Modal isOpen={true}>
      <VerticalFlex
        padding="24px 0 0"
        width="100%"
        height="100%"
        align={'center'}
        justify={'flex-end'}
      >
        <VerticalFlex grow="1" align="center">
          <IllustrationPlaceholder>
            <SubTextTypography>Illustration</SubTextTypography>
          </IllustrationPlaceholder>
          <Typography size={24} weight={700} margin="32px 0 0">
            Asset Sent
          </Typography>
        </VerticalFlex>
        {explorerUrl && (
          <TextButton
            as="a"
            href={explorerUrl}
            target="_blank"
            margin="0 0 36px"
          >
            <StyledLinkIcon height="16px" color={theme.colors.primary1} />
            View on Explorer
          </TextButton>
        )}
        <PrimaryButton size={ComponentSize.LARGE} onClick={() => onClose()}>
          Done
        </PrimaryButton>
      </VerticalFlex>
    </Modal>
  );
}
