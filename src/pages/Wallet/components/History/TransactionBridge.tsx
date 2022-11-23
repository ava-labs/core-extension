import {
  BridgeIcon,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TxHistoryItem } from '@src/background/services/history/models';
import styled, { useTheme } from 'styled-components';
import { HistoryItemLink } from './components/HistoryItemLink';
import { useBlockchainNames } from './useBlockchainNames';
import { useTranslation } from 'react-i18next';

export const IconCircle = styled(HorizontalFlex)<{ pending: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.stroke1}`};

  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }

  ${({ pending, theme }) =>
    pending &&
    `
	&:before {
    animation: 2s linear infinite spinner;
    animation-play-state: inherit;
    border: solid 2px transparent;
    border-bottom-color: ${theme.colors.secondary1};
    border-radius: 50%;
    content: '';
    height: 34px;
    width: 34px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    will-change: transform;
  }
	`};
`;

type TransactionBridgeProps = {
  item: TxHistoryItem;
};

export function TransactionBridge({ item }: TransactionBridgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { sourceBlockchain, targetBlockchain } = useBlockchainNames(item);

  return (
    <HorizontalFlex width="100%" justify="space-between" align="center">
      <div style={{ position: 'relative' }}>
        <IconCircle pending={false}>
          <BridgeIcon height="18px" color={theme.colors.stroke2} />
        </IconCircle>
      </div>

      <HorizontalFlex flex={1} justify={'space-between'} margin={'0 0 0 16px'}>
        <VerticalFlex width="100%">
          <HorizontalFlex justify="space-between" width="100%">
            <Typography size={16} weight={500} height="24px">
              {t('Bridge')}
            </Typography>
            <Typography size={14} height="24px">
              {item.amount} {item.token?.symbol}
            </Typography>
          </HorizontalFlex>
          <SubTextTypography size={12} height="17px">
            {sourceBlockchain} -&gt; {targetBlockchain}
          </SubTextTypography>
        </VerticalFlex>
        <HorizontalFlex align="flex-start">
          <HistoryItemLink explorerLink={item.explorerLink} />
        </HorizontalFlex>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
