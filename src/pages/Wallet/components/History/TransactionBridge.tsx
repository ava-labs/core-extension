import {
  BridgeIcon,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { HistoryItemLink } from './components/HistoryItemLink';

const IconCircle = styled(HorizontalFlex)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
`;

export function TransactionBridge({ item }: { item: any }) {
  const theme = useTheme();

  const fromAvalancheToEthereum =
    item.to === '0x0000000000000000000000000000000000000000';

  return (
    <HorizontalFlex width="100%" justify="space-between" align="center">
      <IconCircle background={`${theme.colors.stroke1}`}>
        <BridgeIcon height="18px" color={theme.colors.stroke2} />
      </IconCircle>

      <HorizontalFlex flex={1} justify={'space-between'} margin={'0 0 0 16px'}>
        <VerticalFlex width="100%">
          <HorizontalFlex justify="space-between" width="100%">
            <Typography size={16} weight={500} height="24px">
              Bridging
            </Typography>
            <Typography size={14} height="24px">
              {item.amountDisplayValue} {item.tokenSymbol}
            </Typography>
          </HorizontalFlex>
          {fromAvalancheToEthereum ? (
            <SubTextTypography size={12} height="17px">
              Avalanche -&gt; Ethereum
            </SubTextTypography>
          ) : (
            <SubTextTypography size={12} height="17px">
              Ethereum -&gt; Avalanche
            </SubTextTypography>
          )}
        </VerticalFlex>
        <HorizontalFlex align="flex-start">
          <HistoryItemLink explorerLink={item.explorerLink} />
        </HorizontalFlex>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
