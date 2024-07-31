import { Blockchain, useBridgeSDK } from '@avalabs/core-bridge-sdk';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAvailableBlockchains } from '../hooks/useAvailableBlockchains';
import { blockchainToNetwork } from '../utils/blockchainConversion';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-components';

export const BridgeUnknownNetwork = ({ onSelect }) => {
  const { t } = useTranslation();
  const availableBlockchains = useAvailableBlockchains();
  const blockchain = availableBlockchains.includes(Blockchain.ETHEREUM)
    ? Blockchain.ETHEREUM
    : Blockchain.AVALANCHE;
  const { networks } = useNetworkContext();
  const { bridgeConfig } = useBridgeSDK();
  const network = blockchainToNetwork(blockchain, networks, bridgeConfig);

  return (
    <Stack height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>{t('Back')}</PageTitle>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          mx: 2,
        }}
      >
        <Typography variant="h5">{t(' Network not supported.')}</Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
          {t(
            'Network is not supported. Change network to supported network to continue.'
          )}
        </Typography>
        <Button size="large" fullWidth onClick={() => onSelect(blockchain)}>
          {t('Switch to {{chainName}}', {
            chainName: network?.chainName,
          })}
        </Button>
      </Stack>
    </Stack>
  );
};
