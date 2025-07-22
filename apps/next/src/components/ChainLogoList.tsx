import { styled } from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { FC } from 'react';

const Root = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  marginInline: 'auto',
  flexDirection: 'row-reverse',

  '& > img': {
    position: 'relative',
    marginInlineStart: `-${theme.spacing(0.5)}`,
  },
}));

const CHAIN_IDS_RENDER: Network['chainId'][] = [
  43114, // Avalanche C-Chain
  1, // Ethereum
  8453, // Base
  10, // Optimism
  42161, // Arbitrum
];

type Props = {
  size?: number | string;
};

export const ChainLogoList: FC<Props> = ({ size = 20 }) => {
  const { getNetwork } = useNetworkContext();
  const networks = CHAIN_IDS_RENDER.toReversed()
    .map(getNetwork)
    .filter((n) => n != undefined)
    .filter((n) => n?.logoUri);

  return (
    <Root>
      {networks.map((n) => (
        <img
          src={n.logoUri}
          alt={n.chainName}
          key={n.chainId}
          width={size}
          height={size}
        />
      ))}
    </Root>
  );
};
