import { Typography, useTheme } from '@avalabs/k2-alpine';
import { WalletSummary } from '@/hooks/useActiveAccountInfo';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import { MdNavigateNext } from 'react-icons/md';
import { ClickableStack } from '../styled';

type Props = {
  walletSummary?: WalletSummary;
  maxWidth?: number;
};

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
        '& .hover-arrow': {
          opacity: 0,
        },
        '&:hover .hover-arrow': {
          opacity: 1,
        },
      }}
      onClick={() => {
        history.push(`/wallet/${walletSummary.id}`);
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          marginRight: 4,
        }}
      >
        <WalletIcon
          size={16}
          type={walletSummary.type}
          authProvider={walletSummary.authProvider}
          color={theme.palette.text.secondary}
          expanded={true}
        />
      </div>
      <Typography
        variant="body3"
        color="text.secondary"
        noWrap
        fontWeight="semibold"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}
      >
        {walletSummary.name}
      </Typography>
      <div className="hover-arrow" style={{ flexShrink: 0, height: 16 }}>
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      </div>
    </ClickableStack>
  );
};
