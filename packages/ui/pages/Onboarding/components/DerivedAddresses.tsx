import { truncateAddress } from '@core/utils';
import { AddressType } from '../pages/Ledger/LedgerConnect';
import { getAvalancheAddressLink } from '@core/utils';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Divider,
  ExternalLinkIcon,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  Tooltip,
} from '@avalabs/core-k2-components';
import { useMemo } from 'react';

interface DerivedAddressesProps {
  addresses: AddressType[];
}
export function DerivedAddresses({ addresses }: DerivedAddressesProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const hasBalance = useMemo(() => {
    return addresses.find((address) => address.balance !== '0');
  }, [addresses]);

  return (
    <Card
      sx={{
        width: theme.spacing(43.5),
        height: theme.spacing(21.25),
        backgroundColor: theme.palette.grey[850],
      }}
    >
      <CardContent>
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
            {t('Your Derived Addresses')}
          </Typography>
          <Stack alignItems="space-between" divider={<Divider flexItem />}>
            {addresses.map((addressData, index) => {
              if (hasBalance && addressData.balance === '0') {
                return;
              }
              const explorerLink = getAvalancheAddressLink(addressData.address);

              return (
                <Stack key={index}>
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: 'row',
                      }}
                    >
                      <Stack
                        sx={{
                          pr: 2,
                        }}
                      >
                        <Typography variant="body2">{index + 1}.</Typography>
                      </Stack>
                      <Stack
                        sx={{
                          pr: 2,
                        }}
                      >
                        <Tooltip placement="top" title={addressData.address}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'semibold',
                            }}
                          >
                            {truncateAddress(addressData.address)}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        columnGap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {addressData.balance} AVAX
                      </Typography>
                      {explorerLink && (
                        <Typography
                          as="a"
                          href={explorerLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLinkIcon sx={{ color: 'primary.main' }} />
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
            {addresses.length < 3 && (
              <Stack
                sx={{
                  flexDirection: 'row',
                  py: 1.5,
                  alignItems: 'center',
                }}
                divider={<Divider flexItem />}
              >
                <Stack sx={{ pr: 2 }}>
                  <Typography variant="body2">
                    {addresses.length + 1}.
                  </Typography>
                </Stack>
                <Skeleton
                  sx={{
                    width: theme.spacing(41.3),
                    height: theme.spacing(2),
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
