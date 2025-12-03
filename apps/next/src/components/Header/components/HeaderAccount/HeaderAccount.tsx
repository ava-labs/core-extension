import { FC, useEffect, useRef, useState } from 'react';
import { WalletTotalBalanceProvider } from '@core/ui';
import { AddressList } from '@/components/AddressList';
import { Container } from './styled';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletIcon } from '@/components/WalletIcon';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

type Props = {
  headerInfoWidth: number;
  isAccountInfoVisible: boolean;
};

const HeaderAccountContent: FC<Props> = ({
  headerInfoWidth,
  isAccountInfoVisible,
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { walletSummary, account } = useActiveAccountInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);

  // Delay enabling hover to prevent flash when navigating back
  useEffect(() => {
    const timer = setTimeout(() => setHoverEnabled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container ref={containerRef} sx={{ width: headerInfoWidth }}>
      {isAccountInfoVisible && <PersonalAvatar size="xsmall" sx={{ mr: 1 }} />}

      {walletSummary && account && !isAccountInfoVisible && (
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
          onClick={() => {
            setIsAccountHovered(false);
            setIsAddressListHovered(false);
            history.push('/account-management');
          }}
          onMouseEnter={() => hoverEnabled && setIsAccountHovered(true)}
          onMouseLeave={() => setIsAccountHovered(false)}
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
        onMouseEnter={() => hoverEnabled && setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
        top={56}
      />
    </Container>
  );
};

export const HeaderAccount: FC<Props> = ({
  headerInfoWidth,
  isAccountInfoVisible,
}) => {
  return (
    <WalletTotalBalanceProvider>
      <HeaderAccountContent
        headerInfoWidth={headerInfoWidth}
        isAccountInfoVisible={isAccountInfoVisible}
      />
    </WalletTotalBalanceProvider>
  );
};
