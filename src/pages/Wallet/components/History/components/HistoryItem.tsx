import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import { PropsWithChildren } from 'react';
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
    <HorizontalFlex flex={1} justify={'space-between'} margin={'0 0 0 16px'}>
      <VerticalFlex>
        <Typography size={16} weight={500} height="24px">
          {label}
        </Typography>
        <SubTextTypography size={12} height="17px">
          {item.isSender
            ? `To: ${truncateAddress(item.to ?? '')}`
            : `From: ${truncateAddress(item.from ?? '')}`}
        </SubTextTypography>
      </VerticalFlex>
      <HorizontalFlex align="flex-start">
        {children}
        <HistoryItemLink explorerLink={item.explorerLink} />
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
