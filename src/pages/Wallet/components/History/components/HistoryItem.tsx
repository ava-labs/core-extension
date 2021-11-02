import {
  HorizontalFlex,
  PopoutLinkIcon,
  SubTextTypography,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import React from 'react';
import { useTheme } from 'styled-components';

export function HistoryItem({
  item,
  label,
  children,
}: {
  item: { to?: string; from?: string; isSender: boolean; explorerLink: string };
  label: string;
  children?: any;
}) {
  return (
    <HorizontalFlex
      flex={1}
      align={'center'}
      justify={'space-between'}
      margin={'0 0 0 8px'}
    >
      <VerticalFlex>
        <Typography size={18} weight={400} margin={'0 0 4px 0'}>
          {label}
        </Typography>
        {item.isSender ? (
          <SubTextTypography>
            To: {truncateAddress(item.to ?? '')}
          </SubTextTypography>
        ) : (
          <SubTextTypography>
            From: {truncateAddress(item.from ?? '')}
          </SubTextTypography>
        )}
      </VerticalFlex>
      <HorizontalFlex>
        {children}
        <VerticalFlex>
          <HistoryItemLink item={item} />
        </VerticalFlex>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}

export function HistoryItemLink({ item }: { item: { explorerLink: string } }) {
  const theme = useTheme();

  return (
    <TextButton
      onClick={() => window.open(item.explorerLink, '_blank')}
      margin={'0 0 0 8px'}
    >
      <PopoutLinkIcon height="12px" color={theme.palette.grey['600']} />
    </TextButton>
  );
}
