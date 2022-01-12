import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  LinkIcon,
  SecondaryCard,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { getAddressLink } from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { openNewTab } from '@src/utils/extensionUtils';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';

export function AddressPaths({
  fromAddress,
  toAddress,
}: {
  fromAddress: string;
  toAddress: string;
}) {
  const { accounts } = useAccountsContext();
  const theme = useTheme();

  const account = useMemo(() => {
    return accounts.find((acc) => {
      return acc.addressC.toLowerCase() === fromAddress.toLowerCase();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  return (
    <SecondaryCard width="100%" padding={'14px 16px'}>
      <HorizontalFlex width="100%" padding="0">
        <HorizontalFlex flex={1} justify="center" overflow="hidden">
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
        <HorizontalFlex padding="0 8px">
          <CaretIcon
            height="15px"
            direction={IconDirection.RIGHT}
            color={theme.colors.icon1}
          />
        </HorizontalFlex>
        <HorizontalFlex flex={1} justify="center">
          <TextButton
            onClick={() => openNewTab({ url: getAddressLink(toAddress) })}
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
    </SecondaryCard>
  );
}
