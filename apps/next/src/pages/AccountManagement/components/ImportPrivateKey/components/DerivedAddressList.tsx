import { Card, Divider, Stack } from '@avalabs/k2-alpine';
import { DerivedAddresses } from '../types';
import { DerivedAddressListItem } from './DerivedAddressListItem';

type DerivedAddressesProps = {
  derivedAddresses?: DerivedAddresses;
  isLoading: boolean;
};

export const DerivedAddressList = ({
  derivedAddresses,
  isLoading,
}: DerivedAddressesProps) => {
  return (
    <Card>
      <Stack>
        {derivedAddresses && (
          <>
            <DerivedAddressListItem
              networkType="avalanche"
              address={derivedAddresses.addressC}
              isLoading={isLoading}
            />
            <Divider sx={{ mx: 2 }} />
            <DerivedAddressListItem
              networkType="bitcoin"
              address={derivedAddresses.addressBTC}
              isLoading={isLoading}
            />
          </>
        )}
      </Stack>
    </Card>
  );
};
