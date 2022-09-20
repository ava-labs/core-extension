import {
  HorizontalFlex,
  HorizontalSeparator,
  LinkIcon,
  Skeleton,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import { AddressType } from '../LedgerConnect';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { Network } from '@avalabs/chains-sdk';

const AddressField = styled(HorizontalFlex)<{ padding?: string }>`
  color: ${({ theme }) => theme.colors.text1};
  padding: ${({ padding }) => padding ?? '0 16px 0 0'};
`;

interface DerivedAddressesProps {
  addresses: AddressType[];
  network?: Network;
  hideLoadinSkeleton?: boolean;
}
export function DerivedAddresses({
  addresses,
  network,
  hideLoadinSkeleton,
}: DerivedAddressesProps) {
  const theme = useTheme();

  return (
    <VerticalFlex margin="24px 0 0 0">
      {!hideLoadinSkeleton && (
        <Typography size={12}>Your Derived Addresses</Typography>
      )}
      <VerticalFlex color={theme.colors.text1} align="flex-start" justify="">
        {addresses.map((addressData, index) => {
          const explorerLink = network
            ? getExplorerAddressByNetwork(
                network,
                addressData.address,
                'address'
              )
            : null;
          return (
            <VerticalFlex key={index} width="100%">
              <HorizontalFlex
                padding="12px 0"
                justify="space-between"
                align="center"
              >
                <HorizontalFlex>
                  <AddressField>
                    <Typography size={16}>{index + 1}</Typography>
                  </AddressField>
                  <AddressField>
                    <Typography size={16}>
                      {truncateAddress(addressData.address)}
                    </Typography>
                  </AddressField>
                </HorizontalFlex>
                <AddressField padding="0" align="center">
                  <Typography size={12} margin="0 10px 0 0">
                    {addressData.balance} AVAX
                  </Typography>
                  {explorerLink && (
                    <TextButton
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(explorerLink, '_blank');
                      }}
                    >
                      <LinkIcon height="12px" color={theme.colors.icon2} />
                    </TextButton>
                  )}
                </AddressField>
              </HorizontalFlex>
              <HorizontalSeparator />
            </VerticalFlex>
          );
        })}
        {addresses.length < 3 && !hideLoadinSkeleton && (
          <VerticalFlex width="100%">
            <HorizontalFlex
              padding="12px 0"
              justify="space-between"
              align="center"
            >
              <HorizontalFlex>
                <AddressField>
                  <Typography size={16}>{addresses.length + 1}</Typography>
                </AddressField>
              </HorizontalFlex>
              <Skeleton width="330px" height="16px" />
            </HorizontalFlex>
            <HorizontalSeparator />
          </VerticalFlex>
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
