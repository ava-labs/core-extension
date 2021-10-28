import {
  VerticalFlex,
  Card,
  Typography,
  HorizontalFlex,
  CloseIcon,
  SubTextTypography,
  LoadingIcon,
  TextButton,
} from '@avalabs/react-components';
import {
  ERC20WithBalance,
  isAvaxToken,
} from '@avalabs/wallet-react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { TokenImg } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';
import { Receive } from '../Receive/Receive';
import { SendForm } from '../Send/SendForm';

export function TokenFlowMiniMode() {
  const history = useHistory();
  const { currencyFormatter } = useWalletContext();
  const { currency } = useSettingsContext();
  const theme = useTheme();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const [showSend, setShowSend] = useState<boolean>();

  useEffect(() => {
    setShowSend(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (showSend === undefined) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'}>
      <Card
        width={'100%'}
        height={'110%'}
        margin={'0 0 -40px 0'}
        style={{
          borderRadius: '30px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <VerticalFlex width={'100%'}>
          <HorizontalFlex width={'100%'} justify={'center'}>
            <VerticalFlex justify={'center'}>
              {isAvaxToken(token) ? (
                <AvaxTokenIcon height={'40px'} />
              ) : (
                <TokenImg
                  height={'40px'}
                  width={'40px'}
                  src={(token as ERC20WithBalance).logoURI}
                />
              )}
            </VerticalFlex>
            <VerticalFlex flex={1} margin={'0 0 0 12px'}>
              <Typography size={16}>{token.name}</Typography>
              <Typography size={24} margin={'4px 0'}>
                {token.balanceDisplayValue} {token.symbol}
              </Typography>
              <SubTextTypography>
                {currencyFormatter(Number(token.balanceUSD))} {currency}
              </SubTextTypography>
            </VerticalFlex>
            <VerticalFlex>
              <TextButton onClick={() => history.goBack()}>
                <CloseIcon fill={theme.palette.white} />
              </TextButton>
            </VerticalFlex>
          </HorizontalFlex>
          <VerticalFlex flex={1} width={'100%'} margin={'44px 0 0 0'}>
            <Tabs defaultIndex={showSend ? 0 : 1}>
              <TabList $border={false}>
                <Tab disabled={!showSend}>
                  <Typography weight={600} color={'inherit'}>
                    Send
                  </Typography>
                </Tab>
                <Tab>
                  <Typography weight={600} color={'inherit'}>
                    Receive
                  </Typography>
                </Tab>
                <Tab>
                  <Typography weight={600} color={'inherit'}>
                    Activity
                  </Typography>
                </Tab>
              </TabList>

              <TabPanel>
                <SendForm />
              </TabPanel>
              <TabPanel>
                <Receive />
              </TabPanel>
              <TabPanel>activities</TabPanel>
            </Tabs>
          </VerticalFlex>
        </VerticalFlex>
      </Card>
    </VerticalFlex>
  );
}

export default TokenFlowMiniMode;
