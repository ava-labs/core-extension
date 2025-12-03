import { Typography, useTheme } from '@avalabs/k2-alpine';
import { WalletSummary } from '@/hooks/useActiveAccountInfo';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import { MdNavigateNext } from 'react-icons/md';
import { ClickableStack } from '../styled';

export const WalletSummaryInfo = ({
  walletSummary,
}: {
  walletSummary?: WalletSummary;
}) => {
  const history = useHistory();
  const theme = useTheme();
  const [isWalletHovered, setIsWalletHovered] = useState(false);

  if (!walletSummary) return null;

  return (
    <ClickableStack
      direction="row"
      alignItems="center"
      gap={0.5}
      onMouseEnter={() => setIsWalletHovered(true)}
      onMouseLeave={() => setIsWalletHovered(false)}
      onClick={() => {
        history.push(`/wallet/${walletSummary.id}`);
      }}
    >
      <WalletIcon
        size={16}
        type={walletSummary.type}
        authProvider={walletSummary.authProvider}
      />
      <Typography variant="body3" color="text.secondary">
        {walletSummary.name}
      </Typography>
      {isWalletHovered && (
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      )}
    </ClickableStack>
  );
};
