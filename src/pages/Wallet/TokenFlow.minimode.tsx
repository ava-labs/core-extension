import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  CloseIcon,
  SubTextTypography,
  LoadingIcon,
  TextButton,
} from '@avalabs/react-components';
import {
  ERC20WithBalance,
  isAntToken,
  isAvaxToken,
} from '@avalabs/wallet-react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { TokenIcon } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';
import { Receive } from '../Receive/Receive';
import { ReceiveMiniMode } from '../Receive/Receive.minimode';
import { SendFlow } from '../Send/SendFlow';

export function TokenFlowMiniMode() {
  const history = useHistory();
  const { currency, currencyFormatter } = useSettingsContext();
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

  const balanceCurrencyValue = token.balanceUsdDisplayValue ?? token.balanceUSD;

  return (
    <VerticalFlex width={'100%'} margin="16px" position="relative">
      <HorizontalFlex width={'100%'} justify={'center'}>
        <VerticalFlex justify={'center'}>
          {isAvaxToken(token) ? (
            <AvaxTokenIcon height={'40px'} />
          ) : (
            <TokenIcon
              height={'40px'}
              width={'40px'}
              src={(token as ERC20WithBalance).logoURI}
            />
          )}
        </VerticalFlex>
        <VerticalFlex flex={1} margin={'0 0 0 16px'}>
          <Typography size={16} weight={600} height="24px">
            {token.name}
          </Typography>
          <Typography size={24} margin={'4px 0 8px'} weight={700} height="29px">
            {token.balanceDisplayValue} {token.symbol}
          </Typography>
          <SubTextTypography>
            {balanceCurrencyValue &&
              `${currencyFormatter(Number(balanceCurrencyValue))} ${currency}`}
          </SubTextTypography>
        </VerticalFlex>
        <VerticalFlex>
          <TextButton onClick={() => history.goBack()}>
            <CloseIcon color={theme.colors.icon1} />
          </TextButton>
        </VerticalFlex>
      </HorizontalFlex>
      <VerticalFlex flex={1} width={'100%'} margin={'32px 0 0 0'}>
        <Tabs defaultIndex={showSend ? 0 : 1} grow="1">
          <TabList $border={false}>
            <Tab disabled={!showSend} margin="0px 32px 8px 0">
              <Typography weight={600} color={'inherit'}>
                Send
              </Typography>
            </Tab>
            <Tab margin="0px 32px 8px 0">
              <Typography weight={600} color={'inherit'}>
                Receive
              </Typography>
            </Tab>
            {/* <Tab>
              <Typography weight={600} color={'inherit'}>
                Activity
              </Typography>
            </Tab> */}
          </TabList>

          <TabPanel grow="1">
            <SendFlow />
          </TabPanel>
          <TabPanel grow="1">
            <VerticalFlex grow="1" padding="32px 0 0 0">
              <ReceiveMiniMode
                embedded={true}
                limitToChain={
                  isAvaxToken(token) ? undefined : isAntToken(token) ? 'X' : 'C'
                }
              />
            </VerticalFlex>
          </TabPanel>
          {/* <TabPanel>activities</TabPanel> */}
        </Tabs>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export default TokenFlowMiniMode;
