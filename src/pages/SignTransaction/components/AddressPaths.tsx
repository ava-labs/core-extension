import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  LinkIcon,
  Card,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { openNewTab } from '@src/utils/extensionUtils';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { useGetTransaction } from '../hooks/useGetTransaction';

export function AddressPaths({
  fromAddress,
  toAddress,
}: {
  fromAddress: string;
  toAddress: string;
}) {
  const requestId = useGetRequestId();
  const { network } = useGetTransaction(requestId);
  const { accounts } = useAccountsContext();
  const theme = useTheme();
  const account = useMemo(() => {
    return accounts.find((acc) => {
      return acc.addressC.toLowerCase() === fromAddress.toLowerCase();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  return (
    <Card width="100%" padding={'14px 16px'}>
      <HorizontalFlex align="center" justify="center" width="100%" padding="0">
        <HorizontalFlex justify="center" overflow="hidden">
          <Typography
            size={12}
            height="15px"
            weight={500}
            textOverflow="ellipsis"
            overflow="hidden"
            wrap="nowrap"
          >
            {account?.name ?? truncateAddress(fromAddress, 8)}
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex padding="0 16px">
          <CaretIcon
            height="12px"
            direction={IconDirection.RIGHT}
            color={theme.colors.icon1}
          />
        </HorizontalFlex>
        <HorizontalFlex justify="center">
          <TextButton
            onClick={() =>
              network &&
              openNewTab({
                url: getExplorerAddressByNetwork(network, toAddress, 'address'),
              })
            }
          >
            <HorizontalFlex align="center">
              <AvaxTokenIcon height="16px" />
              <Typography
                size={12}
                height="15px"
                weight={500}
                margin={'0 8px 0 8px'}
              >
                {truncateAddress(toAddress)}
              </Typography>
              <LinkIcon color={theme.colors.icon1} height={'12px'} />
            </HorizontalFlex>
          </TextButton>
        </HorizontalFlex>
      </HorizontalFlex>
    </Card>
  );
}
