import { truncateAddress } from '@src/utils/truncateAddress';
import { AddressType } from '../LedgerConnect';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { Network } from '@avalabs/chains-sdk';
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
} from '@avalabs/k2-components';

interface DerivedAddressesProps {
  addresses: AddressType[];
  network?: Network;
  hideLoadinSkeleton?: boolean;
}
export function DerivedAddresses({
  addresses,
  network,
}: DerivedAddressesProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        width: (theme) => theme.spacing(43.5),
        height: (theme) => theme.spacing(21.25),
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
              const explorerLink = network
                ? getExplorerAddressByNetwork(
                    network,
                    addressData.address,
                    'address'
                  )
                : null;
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
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'semibold',
                          }}
                        >
                          {truncateAddress(addressData.address)}
                        </Typography>
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
                          rel="noopener noreferrer"
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
