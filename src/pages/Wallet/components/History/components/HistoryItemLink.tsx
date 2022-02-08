import { LinkIcon, TextButton } from '@avalabs/react-components';
import { useTheme } from 'styled-components';

interface HistoryItemLinkProps {
  explorerLink: string;
}

export function HistoryItemLink({ explorerLink }: HistoryItemLinkProps) {
  const theme = useTheme();

  return (
    <TextButton
      onClick={() => window.open(explorerLink, '_blank')}
      margin={'6px 0 0 8px'}
    >
      <LinkIcon height="12px" color={theme.colors.icon2} />
    </TextButton>
  );
}
