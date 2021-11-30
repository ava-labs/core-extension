import React from 'react';
import {
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  LinkIcon,
  ComponentSize,
  Card,
  HorizontalFlex,
  CopyIcon,
  toast,
} from '@avalabs/react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import styled, { useTheme } from 'styled-components';
import { useExplorerUrl } from '@src/hooks/useExplorerUrl';

const StyledLinkIcon = styled(LinkIcon)`
  margin: 0 8px 0 0;
`;

const TransparentCard = styled(Card)`
  background-color: ${({ theme }) => `${theme.colors.bg2}80`};
  backdrop-filter: blur(25px);
  box-shadow: 0px 10px 25px ${({ theme }) => `${theme.colors.bg2}0D`};
  border: 1px solid ${({ theme }) => `${theme.colors.bg2}1A`};
`;

export function SuccessFailTxInfo({
  txId,
  onClicked,
  title,
  action,
  message,
}: {
  txId: string;
  onClicked(): void;
  title: string;
  action: string;
  message?: string;
}) {
  const theme = useTheme();
  const explorerUrl = useExplorerUrl(txId, 'C');
  return (
    <>
      <Typography size={24} height="29px" weight={700} margin="16px 0 0">
        {title}
      </Typography>
      <Typography
        size={16}
        height="24px"
        weight={400}
        width={'280px'}
        wordBreak={'break-all'}
      >
        {message}
      </Typography>
      <VerticalFlex
        grow="1"
        align="center"
        justify="flex-end"
        padding="16px 16px 37px"
      >
        {txId ? (
          <>
            <TransparentCard padding="16px 24px 16px 16px">
              <HorizontalFlex
                width="100%"
                align="center"
                justify="space-between"
              >
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
          </>
        ) : (
          ''
        )}
        <PrimaryButton size={ComponentSize.LARGE} onClick={() => onClicked()}>
          {action}
        </PrimaryButton>
      </VerticalFlex>
    </>
  );
}
