import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC, memo, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainLogoList } from '@/components/ChainLogoList';

type Props = {
  ref?: RefObject<HTMLDivElement>;
};

const CChainAddressDisclaimer: FC<Props> = ({ ref }) => {
  const { t } = useTranslation();

  return (
    <Stack ref={ref} gap={0.75} px={2.5}>
      <ChainLogoList size={20} />
      <Typography variant="caption" color="text.secondary" align="center">
        {t(
          'This address supports receiving tokens and NFTs on Avalanche C-Chain, Ethereum, Base, Arbitrum, Optimism and Avalanche L1s',
        )}
      </Typography>
    </Stack>
  );
};

const CChainDisclaimerMemo = memo(CChainAddressDisclaimer);
export { CChainDisclaimerMemo as CChainAddressDisclaimer };
