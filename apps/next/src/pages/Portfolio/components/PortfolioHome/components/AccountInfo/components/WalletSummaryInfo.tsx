import { Typography, useTheme } from '@avalabs/k2-alpine';
import { WalletSummary } from '@/hooks/useActiveAccountInfo';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import { MdNavigateNext } from 'react-icons/md';
import { ClickableStack } from '../styled';
import { useWalletIconSize } from '@/hooks/useWalletIconSize';

type Props = {
  walletSummary?: WalletSummary;
  maxWidth?: number;
};

export const WalletSummaryInfo = ({ walletSummary, maxWidth }: Props) => {
  const history = useHistory();
  const theme = useTheme();
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const walletIconSize = useWalletIconSize(walletSummary?.type, 'header');

  if (!walletSummary) return null;

  return (
    <ClickableStack
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={{ maxWidth: maxWidth ? `${maxWidth}px` : '100%', overflow: 'hidden' }}
      onMouseEnter={() => setIsWalletHovered(true)}
      onMouseLeave={() => setIsWalletHovered(false)}
      onClick={() => {
        history.push(`/wallet/${walletSummary.id}`);
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <WalletIcon
          size={walletIconSize}
          type={walletSummary.type}
          authProvider={walletSummary.authProvider}
        />
      </div>
      <Typography
        variant="body3"
        color="text.secondary"
        noWrap
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {walletSummary.name}
      </Typography>
      {isWalletHovered && (
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      )}
    </ClickableStack>
  );
};
