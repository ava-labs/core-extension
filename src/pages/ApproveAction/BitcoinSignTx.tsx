import { ActionStatus } from '@src/background/services/actions/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useMemo } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { BITCOIN_NETWORK } from '@avalabs/chains-sdk';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { DisplayData_BitcoinSendTx } from '@src/background/services/wallet/handlers/models';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import {
  BitcoinColorIcon,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerApprovalOverlay } from '@src/pages/SignTransaction/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

export function BitcoinSignTx() {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  const requestId = useGetRequestId();
  const tokenPrice = useNativeTokenPrice(BITCOIN_NETWORK);
  const { action, updateAction } = useApproveAction(requestId);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

  const displayData = useMemo<DisplayData_BitcoinSendTx>(() => {
    return action?.displayData;
  }, [action]);

  const btcAmountDisplay = useMemo(() => {
    return displayData
      ? bigIntToString(BigInt(displayData.sendState.amount.toString()), 8)
      : '-';
  }, [displayData]);

  const sendFeeDisplay = useMemo(() => {
    return displayData?.sendState.sendFee
      ? satoshiToBtc(displayData.sendState.sendFee.toNumber()).toString()
      : '-';
  }, [displayData]);

  const sendFeeFiatDisplay = useMemo(() => {
    return sendFeeDisplay === '-'
      ? '-'
      : currencyFormatter(Number(sendFeeDisplay) * tokenPrice);
  }, [currencyFormatter, sendFeeDisplay, tokenPrice]);

  const renderLedgerApproval = () => {
    if (action?.status === ActionStatus.SUBMITTING && isUsingLedgerWallet) {
      return (
        <LedgerApprovalOverlay
          displayData={{
            toAddress: displayData.sendState.address,
            amount: btcAmountDisplay,
            symbol: 'BTC',
            fee: sendFeeDisplay,
          }}
        />
      );
    }
  };

  const signTx = useCallback(() => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet
    );
  }, [requestId, updateAction, isUsingLedgerWallet]);

  // Make the user switch to the correct app or close the window
  useLedgerDisconnectedDialog(window.close, LedgerAppType.BITCOIN);

  if (!action) {
    return <LoadingOverlay />;
  }

  return (
    <Stack sx={{ my: 0, mx: 2, width: 1, justifyContent: 'space-between' }}>
      {renderLedgerApproval()}
      <Stack>
        <Typography
          variant="h2"
          sx={{
            my: 1.5,
          }}
        >
          {t('Approve BTC Send')}
        </Typography>

        <Card>
          <CardContent
            sx={{
              p: 2,
            }}
          >
            <Stack
              sx={{
                my: 2,
              }}
            >
              <Typography
                variant="body3"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Recipient Address')}:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: 'break-all',
                }}
              >
                {displayData.sendState.address}
              </Typography>
            </Stack>
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                mt: 1.5,
              }}
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <BitcoinColorIcon size={'32px'} />
                <Typography sx={{ ml: 1 }} variant="h6">
                  BTC
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {btcAmountDisplay} BTC
                </Typography>
                <Typography
                  variant="body3"
                  sx={{
                    textAlign: 'right',
                    color: 'text.secondary',
                  }}
                >
                  {currencyFormatter(
                    Number(
                      bigIntToString(
                        BigInt(displayData.sendState.amount.toString()),
                        8
                      )
                    ) * tokenPrice
                  )}
                </Typography>
              </Stack>
            </Stack>
            {displayData.balance && (
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body3"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {t('Available Balance')}:
                </Typography>
                <Stack
                  sx={{
                    mt: 1,
                  }}
                >
                  <Typography variant="body3">
                    {displayData.balance.balanceDisplayValue} BTC
                  </Typography>
                  <Typography
                    variant="body3"
                    sx={{
                      textAlign: 'right',
                      color: 'text.secondary',
                    }}
                  >
                    {currencyFormatter(
                      Number(displayData.balance.balanceDisplayValue) *
                        tokenPrice
                    )}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Approve Buttons */}
      <Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body3"
            sx={{
              color: 'text.secondary',
            }}
          >
            {t('Transaction Fee')}:
          </Typography>
          <Stack>
            <Typography
              variant="body3"
              sx={{
                textAlign: 'right',
                fontWeight: 'fontWeightSemibold',
              }}
            >
              {sendFeeDisplay} BTC
            </Typography>
            <Typography
              variant="body3"
              sx={{
                textAlign: 'right',
                color: 'text.secondary',
              }}
            >
              {sendFeeFiatDisplay}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{
            mt: 2,
            mb: 1,
            flexDirection: 'row',
          }}
        >
          <Button
            fullWidth
            size="medium"
            color="secondary"
            sx={{ mr: 1 }}
            onClick={() => {
              updateAction({
                status: ActionStatus.ERROR_USER_CANCELED,
                id: action.id,
              });
              window.close();
            }}
          >
            {t('Reject')}
          </Button>
          <Button
            fullWidth
            size="medium"
            disabled={!!(action?.status === ActionStatus.SUBMITTING)}
            onClick={() => {
              signTx();
            }}
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
