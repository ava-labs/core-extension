import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '@avalabs/types';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import {
  CustomFeesK2,
  GasFeeModifier,
} from '@src/components/common/CustomFeesK2';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { ContactInput } from '../Send/components/ContactInput';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { CollectibleMedia } from './components/CollectibleMedia';
import { useContactFromParams } from '../Send/hooks/useContactFromParams';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { CollectibleSendConfirm } from './components/CollectibleSendConfirm';
import { BigNumber } from 'ethers';
import {
  TokenType,
  NftTokenWithBalance,
  NetworkTokenWithBalance,
} from '@src/background/services/balances/models';
import { useSend } from '../Send/hooks/useSend';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { BN } from 'bn.js';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTranslation } from 'react-i18next';
import { PortfolioTabs } from '../Home/components/Portfolio/Portfolio';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import {
  Button,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
  Card,
  toast,
} from '@avalabs/k2-components';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function CollectibleSend() {
  const { t } = useTranslation();
  const { nft } = useCollectibleFromParams();
  const contactInput = useContactFromParams();
  const setCollectibleParams = useSetCollectibleParams();
  const { sendState, resetSendState, submitSendState, updateSendState } =
    useSend<NftTokenWithBalance>();
  const history = useHistory();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const tokensWithBalances = useTokensWithBalances(true);
  const { capture } = useAnalyticsContext();

  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const [showTxInProgress, setShowTxInProgress] = useState(false);

  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  useEffect(() => {
    if (nft && !sendState.token) {
      updateSendState({
        token: nft,
      });
    }
  }, [nft, sendState.token, updateSendState]);

  const onContactChanged = (contact: Contact) => {
    setCollectibleParams({
      nft: nft,
      address: contact.address,
      options: { replace: true },
    });
    updateSendState({
      address: contact.address,
    });
    capture('NftSendContactSelected', {
      chainId: network?.chainId,
      type: nft?.type,
    });
  };
  const gasToken = tokensWithBalances?.find(
    ({ type }) => type === TokenType.NATIVE
  );
  const maxGasPrice =
    (gasToken as NetworkTokenWithBalance)?.balance.toString() || '0';

  const onGasChanged = useCallback(
    (values: {
      customGasLimit?: number;
      maxFeePerGas: BigNumber;
      maxPriorityFeePerGas?: BigNumber;
      feeType: GasFeeModifier;
    }) => {
      updateSendState({
        customGasLimit: values.customGasLimit,
        maxFeePerGas: values.maxFeePerGas,
        maxPriorityFeePerGas: values.maxPriorityFeePerGas,
      });
      setSelectedGasFee(values.feeType);
    },
    [updateSendState]
  );

  function getURL(hash: string | undefined): string {
    if (hash && network) {
      return getExplorerAddressByNetwork(network, hash);
    }
    return '';
  }

  const onSubmit = () => {
    setShowTxInProgress(true);
    if (!sendState.canSubmit) return;

    let pendingToastId = '';
    if (!isUsingLedgerWallet && !isUsingKeystoneWallet) {
      history.push('/home');
      pendingToastId = toast.loading(t('Transaction pending...'));
    }

    capture('NftSendStarted', { chainId: network?.chainId, type: nft?.type });

    submitSendState()
      .then((txId) => {
        resetSendState();
        toastCardWithLink({
          title: t('Send Successful'),
          url: getURL(txId),
          label: t('View in Explorer'),
        });
        capture('NftSendSucceeded', {
          chainId: network?.chainId,
          type: nft?.type,
        });
        history.push('/home');
      })
      .catch(() => {
        toast.error(t('Transaction Failed'));
        capture('NftSendFailed', {
          chainId: network?.chainId,
          type: nft?.type,
        });
      })
      .finally(() => {
        setShowTxInProgress(false);
        pendingToastId && toast.dismiss(pendingToastId);
        if (isUsingLedgerWallet || isUsingKeystoneWallet) {
          history.push('/home');
        }
      });
  };

  if (!nft) {
    return <Redirect to={`/home?activeTab=${PortfolioTabs.COLLECTIBLES}`} />;
  }

  return (
    <Switch>
      <Route path="/collectible/send/confirm">
        <>
          {showTxInProgress && (
            <TxInProgress
              address={sendState?.token?.address}
              nftName={nft?.name}
              fee={bnToLocaleString(
                sendState?.sendFee || new BN(0),
                network?.networkToken.decimals ?? 18
              )}
              feeSymbol={network?.networkToken.symbol}
            />
          )}
          <CollectibleSendConfirm
            sendState={sendState}
            contact={contactInput as Contact}
            nft={nft}
            onSubmit={onSubmit}
          />
        </>
      </Route>
      <Route path="/collectible/send">
        <Stack
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          <PageTitle>{t('Send')}</PageTitle>
          <Scrollbars
            style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          >
            <ContactInput
              contact={contactInput}
              onChange={onContactChanged}
              isContactsOpen={isContactsOpen}
              setIsOpen={setIsContactsOpen}
            />
            <Stack sx={{ width: '100%', mt: 3, px: 2 }}>
              <Typography
                component="h2"
                variant="body2"
                sx={{ fontWeight: 'semibold', pb: 1 }}
              >
                {t('Collectible')}
              </Typography>
              <Card sx={{ height: 'auto', p: 2, mt: 1 }}>
                <Stack sx={{ flexDirection: 'row' }}>
                  <CollectibleMedia
                    width="80px"
                    height="auto"
                    url={nft?.logoSmall || nft.logoUri}
                    hover={false}
                  />
                  <Typography component="h2" variant="body2" sx={{ ml: 2 }}>
                    {nft?.name}
                  </Typography>
                </Stack>
              </Card>
            </Stack>

            <Stack sx={{ width: '100%', px: 2, mt: 3 }}>
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  mt: 2,
                  mb: 1,
                }}
              >
                <TransactionFeeTooltip
                  gasPrice={sendState?.maxFeePerGas || BigNumber.from(0)}
                  gasLimit={sendState.customGasLimit || sendState?.gasLimit}
                  network={network}
                />
              </Stack>
              <Stack sx={{ width: '100%' }}>
                <CustomFeesK2
                  maxFeePerGas={sendState?.maxFeePerGas || BigNumber.from(0)}
                  limit={sendState.customGasLimit || sendState?.gasLimit || 0}
                  onChange={onGasChanged}
                  onModifierChangeCallback={(
                    modifier: GasFeeModifier | undefined
                  ) => {
                    capture('NftSendFeeOptionChanged', { modifier });
                  }}
                  maxGasPrice={maxGasPrice}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                />
              </Stack>
            </Stack>

            <Stack
              sx={{
                flexGrow: 1,
                justifyContent: 'flex-end',
                py: 3,
                px: 2,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Tooltip
                placement="top"
                title={
                  sendState.error ? (
                    <Typography variant="body2">
                      {sendState.error?.message}
                    </Typography>
                  ) : (
                    ''
                  )
                }
              >
                <Button
                  data-testid="send-next-button"
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setCollectibleParams({
                      nft,
                      address: contactInput?.address,
                      options: { path: '/collectible/send/confirm' },
                    });
                  }}
                  disabled={!sendState.canSubmit}
                  sx={{ width: '343px' }}
                >
                  {t('Next')}
                </Button>
              </Tooltip>
            </Stack>
          </Scrollbars>
        </Stack>
      </Route>
    </Switch>
  );
}
