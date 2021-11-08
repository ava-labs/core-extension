import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import React, { PropsWithChildren } from 'react';
import { HistoryItemLink } from './HistoryItemLink';

interface HistoryItemProps {
  item: { to?: string; from?: string; isSender: boolean; explorerLink: string };
  label: string;
}

export function HistoryItem({
  item,
  label,
  children,
}: PropsWithChildren<HistoryItemProps>) {
  return (
    <HorizontalFlex
      flex={1}
      align={'center'}
      justify={'space-between'}
      margin={'0 0 0 8px'}
    >
      <VerticalFlex>
        <Typography size={16} weight={600} height="24px">
          {label}
        </Typography>
        <SubTextTypography size={12} height="15px">
          {item.isSender
            ? `To: ${truncateAddress(item.to ?? '')}`
            : `From: ${truncateAddress(item.from ?? '')}`}
        </SubTextTypography>
      </VerticalFlex>
      <HorizontalFlex align="center">
        {children}
        <HistoryItemLink explorerLink={item.explorerLink} />
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
