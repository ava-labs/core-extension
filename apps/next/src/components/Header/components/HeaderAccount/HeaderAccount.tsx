import { FC, useRef, useState } from 'react';
import { WalletTotalBalanceProvider } from '@core/ui';
import { AddressList } from '@/components/AddressList';
import { Container } from './styled';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import {
  useActiveAccountInfo,
  WalletSummary,
} from '@/hooks/useActiveAccountInfo';
import { WalletIcon } from '@/components/WalletIcon';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';

type Props = {
  wallet: WalletSummary;
  isTrueWallet: boolean;
};

const HeaderAccountContent: FC<Props> = () => {
  const theme = useTheme();
  const { walletSummary } = useActiveAccountInfo();

  const { account } = useActiveAccountInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const accountInfoVisible = false;

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setIsAccountHovered(true)}
      onMouseLeave={() => setIsAccountHovered(false)}
    >
      {accountInfoVisible && <PersonalAvatar size="xsmall" sx={{ mr: 1 }} />}

      {walletSummary && account && !accountInfoVisible && (
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          sx={{
            p: 1,
            backgroundColor: 'background.navBarItem',
            borderRadius: 2,
            mt: 1.25,
          }}
        >
          <PersonalAvatar size="xsmall" sx={{ mr: 1 }} />

          <Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <WalletIcon
                size={16}
                type={walletSummary.type}
                authProvider={walletSummary.authProvider}
              />
              <Typography variant="caption2" color="text.secondary" noWrap>
                {walletSummary.name}
              </Typography>
            </Stack>

            <Typography variant="body2">{account?.name}</Typography>
          </Stack>
          <MdUnfoldMore size={16} color={theme.palette.text.secondary} />
        </Stack>
      )}

      <AddressList
        isAddressAppear={isAccountHovered || isAddressListHovered}
        activeAccount={account}
        onMouseEnter={() => setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
      />
    </Container>
  );
};

export const HeaderAccount: FC<Props> = ({ wallet, isTrueWallet }) => {
  return (
    <WalletTotalBalanceProvider>
      <HeaderAccountContent wallet={wallet} isTrueWallet={isTrueWallet} />
    </WalletTotalBalanceProvider>
  );
};
