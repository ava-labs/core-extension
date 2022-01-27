import {
  VerticalFlex,
  SimpleAddress,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { ActivityFlow } from '@src/pages/Activity/ActivityFlow';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { TokenListMiniMode } from './TokenList.minimode';
import { TokenSearch } from './TokenSearch';
import { WalletBalancesMiniMode } from './WalletBalances.minimode';

const BalanceWithButtons = styled(VerticalFlex)`
  backface-visibility: hidden;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const TokenSearchWithAnimation = styled(TokenSearch)`
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
`;

const Flipper = styled(VerticalFlex)`
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
`;

const FlipContainer = styled(VerticalFlex)<{
  showSearch: boolean;
}>`
  perspective: 1000;

  ${Flipper} {
    ${({ showSearch }) => showSearch && `transform: rotateY(180deg);`}
  }
`;

const Tabs = styled(HorizontalFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.separator.color}`};
`;

const Tab = styled.button<{ selected?: boolean }>`
  border: none;
  background: transparent;
  width: 50%;
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: ${({ selected, theme }) =>
    selected ? `2px solid ${theme.colors.text1}` : '2px solid transparent'}; ;
`;

export function PortfolioMiniMode() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>('assets');
  const { addresses } = useWalletContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const getAddress = () => {
    return addresses.addrC;
  };

  return (
    <>
      {getAddress() && (
        <HorizontalFlex justify="center" margin="-8px 0 0 0">
          <SimpleAddress
            copyIconProps={{ color: theme.colors.icon2 }}
            typographyProps={{ color: 'text2', size: 14 }}
            address={getAddress()}
          />
        </HorizontalFlex>
      )}

      <FlipContainer height={'138px'} showSearch={showSearch}>
        <Flipper>
          <TokenSearchWithAnimation
            query={searchQuery}
            onBack={() => {
              setSearchQuery('');
              setShowSearch(false);
            }}
            onSearch={(term) => setSearchQuery(term)}
          />
          <BalanceWithButtons>
            <WalletBalancesMiniMode />
            <Tabs
              justify="center"
              align="center"
              padding="0 16px 0 16px"
              margin="12px 0 0 0"
            >
              <Tab
                selected={selectedTab === 'assets'}
                onClick={() => setSelectedTab('assets')}
              >
                <Typography size={14}>Assets</Typography>
              </Tab>
              <Tab
                selected={selectedTab === 'activity'}
                onClick={() => setSelectedTab('activity')}
              >
                <Typography size={14}>Activity</Typography>
              </Tab>
            </Tabs>
          </BalanceWithButtons>
        </Flipper>
      </FlipContainer>

      {selectedTab === 'assets' && (
        <TokenListMiniMode searchQuery={searchQuery} />
      )}

      {selectedTab === 'activity' && <ActivityFlow />}
    </>
  );
}
