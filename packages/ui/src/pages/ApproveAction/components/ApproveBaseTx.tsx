import {
  AvalancheColorIcon,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { TokenUnit, bigIntToString } from '@avalabs/core-utils-sdk';
import { useSettingsContext } from '@/contexts/SettingsProvider';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { AvalancheChainStrings } from '@core/types';
import { PVM } from '@avalabs/avalanchejs';

export function BaseTxView({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.BaseTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { chain, txFee, outputs, memo } = tx;

  const defaultDenomination = chain === PVM ? 9 : 0;

  const isDateFuture = (date: bigint) => {
    const now = Avalanche.getUnixNow();
    return date > now;
  };

  const unixToLocaleString = (date: bigint) => {
    return new Date(Number(date.toString()) * 1000).toLocaleString();
  };

  const getDisplayAmount = (value: bigint, decimals: number) => {
    return Number(
      bigIntToString(value, decimals).replace(/,/g, ''), // Remove thousand separators which makes Number to return NaN
    );
  };

  const fee = new TokenUnit(txFee, 9, 'AVAX');

  return (
    <Stack>
      {/* source chain */}
      <Stack>
        <Card
          sx={{
            width: 1,
          }}
        >
          <CardContent
            sx={{
              p: 2,
            }}
          >
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Source Chain')}
              </Typography>
              <Typography variant="caption">
                {AvalancheChainStrings[chain]}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* details */}
      <Stack>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'fontWeightSemibold',
            mt: 2,
            mb: 1,
            mx: 0,
          }}
        >
          {t('Details')}
        </Typography>
        {outputs.map((out) => (
          <Card
            key={out.assetDescription?.assetID}
            sx={{
              width: 1,
              mb: 2,
            }}
          >
            <CardContent
              sx={{
                p: 2,
              }}
            >
              <Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {out.isAvax && (
                      <AvalancheColorIcon size={'32px'} sx={{ mr: 1 }} />
                    )}
                    <Typography variant="h6">
                      {out.assetDescription?.symbol ?? (out.isAvax && 'AVAX')}
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
                      {getDisplayAmount(
                        out.amount,
                        out.assetDescription?.denomination ||
                          defaultDenomination,
                      )}{' '}
                      {out.assetDescription?.symbol ??
                        (out.isAvax ? 'AVAX' : '')}
                    </Typography>
                    {out.isAvax && (
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: 'right',
                          color: 'text.secondary',
                        }}
                      >
                        {currencyFormatter(
                          getDisplayAmount(
                            out.amount,
                            out.assetDescription?.denomination ||
                              defaultDenomination,
                          ) * avaxPrice,
                        )}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                {isDateFuture(out.locktime) && (
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {t('Locktime')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: 'right',
                        fontWeight: 'fontWeightSemibold',
                      }}
                    >
                      {unixToLocaleString(out.locktime)}
                    </Typography>
                  </Stack>
                )}
                {out.owners.length > 1 && (
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {t('Threshold')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: 'right',
                        fontWeight: 'fontWeightSemibold',
                      }}
                    >
                      {out.threshold.toString()}
                    </Typography>
                  </Stack>
                )}
                <Stack sx={{ mt: 0.5 }}>
                  <Typography>{t('Recipients')}</Typography>
                  {out.owners.map((address) => (
                    <Typography
                      key={address}
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {address}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* network fee */}
      <Stack>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'fontWeightSemibold',
            mt: 1,
            mb: 1,
            mx: 0,
          }}
        >
          {t('Network Fee')}
        </Typography>
        <Card
          sx={{
            width: 1,
          }}
        >
          <CardContent
            sx={{
              p: 2,
            }}
          >
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('Fee Amount')}
              </Typography>
              <Stack>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {fee.toDisplay()} AVAX
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'right',
                    color: 'text.secondary',
                  }}
                >
                  {currencyFormatter(
                    fee.toDisplay({ asNumber: true }) * avaxPrice,
                  )}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* memo */}
      {chain !== PVM && memo && (
        <Stack>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'fontWeightSemibold',
              mt: 3,
              mb: 1,
              mx: 0,
            }}
          >
            {t('Memo')}
          </Typography>
          <Card
            sx={{
              width: 1,
            }}
          >
            <CardContent
              sx={{
                p: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {memo}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Stack>
  );
}
