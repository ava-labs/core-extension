import { useTranslation } from 'react-i18next';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Card,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { useQueryParams } from '@src/hooks/useQueryParams';
import { isValidAddress } from '@src/utils/isAddressValid';
import { handleTxOutcome } from '@src/utils/handleTxOutcome';
import { SendErrorMessage } from '@src/utils/send/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

import { useEVMSend } from '../Send/hooks/useSend/useEVMSend';
import { ContactInput } from '../Send/components/ContactInput';
import { useIdentifyAddress } from '../Send/hooks/useIdentifyAddress';
import { getSendErrorMessage } from '../Send/utils/sendErrorMessages';
import { useValidAddressFromParams } from '../Send/hooks/useValidAddressFromParams';
import { SendOptions, SendPageProps } from '../Send/models';

import { CollectibleMedia } from './components/CollectibleMedia';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
} from '@avalabs/vm-module-types';

type Props = SendPageProps<
  JsonRpcBatchInternal,
  NetworkTokenWithBalance,
  [NftTokenWithBalance]
>;

export const SendEVMCollectible = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,

  onSuccess,
  onFailure,
  onApproved,
}: Props) => {
  const { t } = useTranslation();
  const params = useQueryParams();
  const identifyAddress = useIdentifyAddress();
  const addressFromParams = useValidAddressFromParams(isValidAddress);
  const [address, setAddress] = useState(addressFromParams);
  const contact = useMemo(
    () => (address ? identifyAddress(address) : undefined),
    [address, identifyAddress]
  );
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const setCollectibleParams = useSetCollectibleParams();
  const [token] = tokenList;
  const { capture } = useAnalyticsContext();

  const { error, isSending, isValid, isValidating, send, validate } =
    useEVMSend({
      chainId: `0x${network.chainId.toString(16)}`,
      from: fromAddress,
      maxFee,
      nativeToken,
      provider,
    });

  useEffect(() => {
    validate({ address, token });

    if (
      address !== params.get('address') ||
      token.address !== params.get('nft') ||
      token.tokenId !== params.get('tokenId')
    ) {
      setCollectibleParams({
        address,
        nft: token,
        options: { replace: true },
      });
    }
  }, [address, token, validate, setCollectibleParams, params]);

  const onSend = useCallback(async () => {
    if (!isValid) {
      return;
    }

    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError,
    } = await handleTxOutcome(send({ address, token } as SendOptions));

    if (isApproved) {
      onApproved();

      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, isValid, onApproved, onFailure, onSuccess, send, token]);

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', width: '100%', pt: 1 }}>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <Stack ref={formRef}>
          <ContactInput
            contact={contact}
            onChange={(newContact) => {
              setAddress(newContact?.address ?? '');
              capture('NftSendContactSelected', {
                chainId: network?.chainId,
                type: token.type,
              });
            }}
            isContactsOpen={isContactsOpen}
            setIsOpen={(open) => setIsContactsOpen(open)}
            containerRef={formRef}
          />
          <Stack
            sx={{
              pl: 2,
              mt: 0.5,
              width: '100%',
              height: 2,
            }}
          >
            {(error === SendErrorMessage.ADDRESS_REQUIRED ||
              error === SendErrorMessage.INVALID_ADDRESS) && (
              <Typography
                variant="caption"
                sx={{ color: (theme) => theme.palette.error.main }}
              >
                {getSendErrorMessage(error)}
              </Typography>
            )}
          </Stack>

          <Stack sx={{ py: 0, px: 2, mt: 4, width: '100%' }}>
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
                  url={token.logoSmall || token.logoUri}
                  hover={false}
                />
                <Typography component="h2" variant="body2" sx={{ ml: 2 }}>
                  {token.name}
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Scrollbars>
      {!isContactsOpen && (
        <Stack
          sx={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            pt: 3,
            px: 2,
            pb: 3,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Tooltip
            placement="top"
            sx={{ width: '100%' }}
            title={
              error ? (
                <Typography variant="body2">
                  {getSendErrorMessage(error)}
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
              onClick={onSend}
              disabled={isValidating || !isValid || isSending}
              isLoading={isSending}
              fullWidth
            >
              {t('Next')}
            </Button>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};
