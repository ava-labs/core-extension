import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  BuyIcon,
  HorizontalFlex,
  QRCodeIcon,
  SecondaryButton,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';

import { ChainId } from '@avalabs/chains-sdk';
import { useBuyClick } from '@src/hooks/useBuyClick';

const StyledBuyIcon = styled(BuyIcon)`
  width: 16px;
  margin: 0 8px 0 0;
`;

const StyledQRCodeIcon = styled(QRCodeIcon)`
  width: 16px;
  border-color: ${({ theme }) => theme.colors.icon1};
  margin: 0 8px 0 0;
`;

export function ZeroWidget() {
  const theme = useTheme();
  const { network } = useNetworkContext();
  const { onBuyClick } = useBuyClick();

  const history = useHistory();

  if (network?.chainId === ChainId.AVALANCHE_MAINNET_ID) {
    return (
      <HorizontalFlex margin={'24px 0 0 0'} justify={'space-between'}>
        <SecondaryButton
          width={'150px'}
          onClick={(e) => {
            e.stopPropagation();
            onBuyClick();
          }}
        >
          <StyledBuyIcon color={theme.colors.icon1} />
          Buy
        </SecondaryButton>
        <SecondaryButton
          width={'150px'}
          onClick={(e) => {
            e.stopPropagation();
            history.push('/receive');
          }}
        >
          <StyledQRCodeIcon color={theme.colors.icon1} />
          Receive
        </SecondaryButton>
      </HorizontalFlex>
    );
  }
  return (
    <HorizontalFlex margin={'24px 0 0 0'}>
      <SecondaryButton
        width="100%"
        onClick={(e) => {
          e.stopPropagation();
          history.push('/receive');
        }}
      >
        <StyledQRCodeIcon color={theme.colors.icon1} />
        Receive
      </SecondaryButton>
    </HorizontalFlex>
  );
}
