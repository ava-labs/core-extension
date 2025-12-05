import { Box, Typography, useTheme } from '@avalabs/k2-alpine';
import { WalletSummary } from '@/hooks/useActiveAccountInfo';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import { MdNavigateNext } from 'react-icons/md';
import { ClickableStack } from '../styled';

type Props = {
  walletSummary?: WalletSummary;
  maxWidth?: number;
};

const HOVER_ARROW_CLASS = 'hover-arrow';

export const WalletSummaryInfo = ({ walletSummary, maxWidth }: Props) => {
  const history = useHistory();
  const theme = useTheme();

  if (!walletSummary) return null;

  return (
    <ClickableStack
      direction="row"
      alignItems="center"
      sx={{
        maxWidth: maxWidth ? `${maxWidth}px` : '100%',
        [`& .${HOVER_ARROW_CLASS}`]: {
          opacity: 0,
        },
        [`&:hover .${HOVER_ARROW_CLASS}`]: {
          opacity: 1,
        },
      }}
      onClick={() => {
        history.push(`/wallet/${walletSummary.id}`);
      }}
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
      <Typography
        variant="body3"
        color="text.secondary"
        noWrap
        fontWeight="semibold"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}
      >
        {walletSummary.name}
      </Typography>
      <Box className={HOVER_ARROW_CLASS} flexShrink={0} height={16}>
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      </Box>
    </ClickableStack>
  );
};
