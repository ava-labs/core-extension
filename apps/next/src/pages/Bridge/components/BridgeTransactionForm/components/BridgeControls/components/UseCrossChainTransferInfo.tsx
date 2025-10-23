import { CORE_WEB_BASE_URL } from '@/config';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import {
  caipToChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline } from 'react-icons/md';

type Props = {
  networkId: string;
};

const UseCrossChainTransferInfo: FC<Props> = ({ networkId }) => {
  const { t } = useTranslation();

  const chainId = caipToChainId(networkId);
  const networkName = isPchainNetworkId(chainId)
    ? t('P-Chain')
    : isXchainNetworkId(chainId)
      ? t('X-Chain')
      : t("the selected network's");

  return (
    <Stack
      direction="column"
      gap={0.5}
      alignItems="center"
      color="error.main"
      pt={3}
      pb={3.5}
    >
      <MdInfoOutline color="error" size={20} />
      <Typography variant="subtitle4" width={210} textAlign="center">
        {t(
          'To move {{network}} funds, you need to complete a cross-chain transfer',
          { network: networkName },
        )}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="extension"
        sx={{ mt: 1.5 }}
        href={`${CORE_WEB_BASE_URL}/stake/cross-chain-transfer`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('Go to cross-chain transfer')}
      </Button>
    </Stack>
  );
};

const UseCrossChainTransferInfoMemo = memo(UseCrossChainTransferInfo);
export { UseCrossChainTransferInfoMemo as UseCrossChainTransferInfo };
