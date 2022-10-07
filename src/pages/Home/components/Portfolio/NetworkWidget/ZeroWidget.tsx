import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  BuyIcon,
  HorizontalFlex,
  SecondaryButton,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';

import { ChainId } from '@avalabs/chains-sdk';
import { useBuyClick } from '@src/hooks/useBuyClick';
import { StyledQRCodeIcon } from './common/StyledQRCodeIcon';
import { t } from 'i18next';

const StyledBuyIcon = styled(BuyIcon)`
  width: 16px;
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
          {t('Buy')}
        </SecondaryButton>
        <SecondaryButton
          width={'150px'}
          onClick={(e) => {
            e.stopPropagation();
            history.push('/receive');
          }}
        >
          <StyledQRCodeIcon color={theme.colors.icon1} />
          {t('Receive')}
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
        {t('Receive')}
      </SecondaryButton>
    </HorizontalFlex>
  );
}
