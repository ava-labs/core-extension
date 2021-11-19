import React from 'react';
import {
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  LinkIcon,
  ComponentSize,
  useThemeContext,
  Card,
  HorizontalFlex,
  CopyIcon,
  toast,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { useExplorerUrl } from '@src/hooks/useExplorerUrl';
import { Modal } from '@src/components/common/Modal';
import { truncateAddress } from '@src/utils/truncateAddress';

const StyledLinkIcon = styled(LinkIcon)`
  margin: 0 8px 0 0;
`;

const ContainerWithBg = styled(VerticalFlex)<{ isDarkTheme: boolean }>`
  background: ${({ isDarkTheme }) =>
    isDarkTheme
      ? `url(images/illustrations/successful-transation-dark.png)`
      : `url(images/illustrations/successful-transation-light.png)`};
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.bg4};
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0 0;
`;

const TransparentCard = styled(Card)`
  background-color: ${({ theme }) => `${theme.colors.bg2}80`};
  backdrop-filter: blur(25px);
  box-shadow: 0px 10px 25px ${({ theme }) => `${theme.colors.bg2}0D`};
  border: 1px solid ${({ theme }) => `${theme.colors.bg2}1A`};
`;

export function TransactionConfirmation({
  txId,
  onClose,
}: {
  txId: string;
  onClose(): void;
}) {
  const theme = useTheme();
  const { darkMode } = useThemeContext();
  const explorerUrl = useExplorerUrl(txId, 'C');
  return (
    <Modal isOpen={true}>
      <ContainerWithBg isDarkTheme={!!darkMode}>
        <Typography size={24} height="29px" weight={700} margin="16px 0 0">
          Successful Transaction
        </Typography>
        <VerticalFlex
          grow="1"
          align="center"
          justify="flex-end"
          padding="16px 16px 37px"
        >
          <TransparentCard padding="16px 24px 16px 16px">
            <HorizontalFlex width="100%" align="center" justify="space-between">
              <VerticalFlex>
                <Typography size={12} height="15px" margin="0 0 8px">
                  Transaction hash
                </Typography>
                <Typography height="24px">
                  {truncateAddress(txId, 10)}
                </Typography>
              </VerticalFlex>
              <CopyIcon
                height="23px"
                color={theme.colors.icon1}
                onClick={() => {
                  navigator.clipboard.writeText(txId);
                  toast.success('Copied!');
                }}
              />
            </HorizontalFlex>
          </TransparentCard>
          {explorerUrl && (
            <TextButton
              as="a"
              href={explorerUrl}
              target="_blank"
              margin="32px 0 24px"
            >
              <StyledLinkIcon height="16px" color={theme.colors.primary1} />
              View on Explorer
            </TextButton>
          )}
          <PrimaryButton size={ComponentSize.LARGE} onClick={() => onClose()}>
            Done
          </PrimaryButton>
        </VerticalFlex>
      </ContainerWithBg>
    </Modal>
  );
}
