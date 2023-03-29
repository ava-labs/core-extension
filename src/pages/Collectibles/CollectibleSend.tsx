import { useCallback, useEffect, useState } from 'react';
import {
  toast,
  ComponentSize,
  PrimaryButton,
  Tooltip,
  Typography,
  VerticalFlex,
  TransactionToastType,
  TransactionToast,
  LoadingSpinnerIcon,
  WarningIcon,
  Card,
  HorizontalFlex,
} from '@avalabs/react-components';
import type { Contact } from '@avalabs/types';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTheme } from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
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
import { WalletType } from '@src/background/services/wallet/models';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { BN } from 'bn.js';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTranslation } from 'react-i18next';
import { PortfolioTabs } from '../Home/components/Portfolio/Portfolio';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';

export function CollectibleSend() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const { nft } = useCollectibleFromParams();
  const contactInput = useContactFromParams();
  const setCollectibleParams = useSetCollectibleParams();
  const { sendState, resetSendState, submitSendState, updateSendState } =
    useSend<NftTokenWithBalance>();
  const history = useHistory();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const tokensWithBalances = useTokensWithBalances(true);

  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const [showTxInProgress, setShowTxInProgress] = useState(false);

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
  };
  const gasToken = tokensWithBalances?.find((t) => t.type === TokenType.NATIVE);
  const maxGasPrice =
    (gasToken as NetworkTokenWithBalance)?.balance.toString() || '0';

  const onGasChanged = useCallback(
    (values: {
      customGasLimit?: number;
      gasPrice: BigNumber;
      feeType: GasFeeModifier;
    }) => {
      updateSendState({
        customGasLimit: values.customGasLimit,
        gasPrice: values.gasPrice,
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

    let toastId: string;
    if (walletType !== WalletType.LEDGER) {
      history.push('/home');
      toastId = toast.custom(
        <TransactionToast
          type={TransactionToastType.PENDING}
          text={t('Transaction pending...')}
          startIcon={
            <LoadingSpinnerIcon height="16px" color={theme.colors.icon1} />
          }
        />
      );
    }

    submitSendState()
      .then((txId) => {
        resetSendState();
        toast.custom(
          <TransactionToast
            status={t('Transaction Successful')}
            type={TransactionToastType.SUCCESS}
            text={t('View in Explorer')}
            href={getURL(txId)}
          />,
          { id: toastId }
        );
        history.push('/home');
      })
      .catch(() => {
        toast.custom(
          <TransactionToast
            type={TransactionToastType.ERROR}
            text={t('Transaction Failed')}
            startIcon={<WarningIcon height="20px" color={theme.colors.icon1} />}
          />,
          { id: toastId, duration: Infinity }
        );
      })
      .finally(() => {
        setShowTxInProgress(false);
        if (walletType === WalletType.LEDGER) history.push('/home');
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
        <VerticalFlex height="100%" width="100%">
          <PageTitle>{t('Send')}</PageTitle>
          <VerticalFlex grow="1" align="center" width="100%" paddingTop="8px">
            <ContactInput
              contact={contactInput}
              onChange={onContactChanged}
              isContactsOpen={isContactsOpen}
              setIsOpen={setIsContactsOpen}
            />
            <VerticalFlex width="100%" margin="24px 0 0" padding="0 16px">
              <Typography size={12} height="15px">
                {t('Collectible')}
              </Typography>
              <Card padding="16px" margin="8px 0 0" height="auto">
                <HorizontalFlex>
                  <CollectibleMedia
                    width="auto"
                    maxWidth="80px"
                    height="80px"
                    url={nft?.logoSmall || nft.logoUri}
                    hover={false}
                  />
                  <Typography size={14} height="17px" margin="0 0 0 16px">
                    {nft?.name}
                  </Typography>
                </HorizontalFlex>
              </Card>
            </VerticalFlex>

            <VerticalFlex width="100%" margin="24px 0 0" padding="0 16px">
              <HorizontalFlex margin="16px 0 8px" width="100%" align="center">
                <Typography size={12} height="15px" margin="0 8px 0 0">
                  {t('Network Fee')}
                </Typography>
                <TransactionFeeTooltip
                  gasPrice={sendState?.gasPrice || BigNumber.from(0)}
                  gasLimit={sendState.customGasLimit || sendState?.gasLimit}
                  network={network}
                />
              </HorizontalFlex>
              <VerticalFlex width="100%">
                <CustomFees
                  gasPrice={sendState?.gasPrice || BigNumber.from(0)}
                  limit={sendState.customGasLimit || sendState?.gasLimit || 0}
                  onChange={onGasChanged}
                  maxGasPrice={maxGasPrice}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                />
              </VerticalFlex>
            </VerticalFlex>

            <VerticalFlex
              align="center"
              justify="flex-end"
              width="100%"
              padding="0 16px 24px"
              grow="1"
            >
              <Tooltip
                content={
                  <Typography size={14} height="1.5">
                    {sendState.error?.message}
                  </Typography>
                }
                disabled={!sendState.error?.error}
              >
                <PrimaryButton
                  size={ComponentSize.LARGE}
                  width="343px"
                  onClick={() => {
                    setCollectibleParams({
                      nft,
                      address: contactInput?.address,
                      options: { path: '/collectible/send/confirm' },
                    });
                  }}
                  disabled={!sendState.canSubmit}
                >
                  {t('Next')}
                </PrimaryButton>
              </Tooltip>
            </VerticalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </Route>
    </Switch>
  );
}
