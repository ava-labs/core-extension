import { PopoutLinkIcon, TextButton } from '@avalabs/react-components';
import React from 'react';
import { useTheme } from 'styled-components';

interface HistoryItemLinkProps {
  explorerLink: string;
}

export function HistoryItemLink({ explorerLink }: HistoryItemLinkProps) {
  const theme = useTheme();

  return (
    <TextButton
      onClick={() => window.open(explorerLink, '_blank')}
      margin={'0 0 0 8px'}
    >
      <PopoutLinkIcon height="12px" color={theme.colors.icon2} />
    </TextButton>
  );
}