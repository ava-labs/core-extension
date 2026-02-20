import { Box, useTheme } from '@avalabs/k2-alpine';
import { WalletSummary } from '@/hooks/useActiveAccountInfo';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import { MdNavigateNext } from 'react-icons/md';
import { ClickableStack } from '../styled';
import { TruncatedText } from '@/components/Header/components/styledComponents';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import { useCallback } from 'react';

type Props = {
  walletSummary: WalletSummary;
};

export const WalletSummaryInfo = ({ walletSummary }: Props) => {
  const history = useHistory();
  const theme = useTheme();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      const route =
        walletSummary.id === IMPORTED_ACCOUNTS_WALLET_ID
          ? '/account-management'
          : `/wallet/${walletSummary.id}`;

      history.push(route);
    },
    [history, walletSummary.id],
  );

  return (
    <ClickableStack
      direction="row"
      alignItems="center"
      maxWidth="75%"
      position="relative"
      onClick={handleClick}
    >
      <Box flexShrink={0} display="flex" alignItems="center" marginRight={0.5}>
        <WalletIcon
          size={16}
          type={walletSummary.type}
          authProvider={walletSummary.authProvider}
          color={theme.palette.text.secondary}
          expanded={true}
        />
      </Box>
      <TruncatedText variant="body3" color="text.secondary" showEllipsis>
        {walletSummary.name}
      </TruncatedText>
      <Box flexShrink={0} height={16}>
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      </Box>
    </ClickableStack>
  );
};
