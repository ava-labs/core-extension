import { useState } from 'react';
import { Collapse, Stack } from '@avalabs/core-k2-components';

import { SecretType } from '@src/background/services/secrets/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { PrimaryAccount } from '@src/background/services/accounts/models';

import { SelectionMode } from '../providers/AccountManagerProvider';
import { AccountItem } from './AccountItem';
import WalletHeader from './WalletHeader';

export const WalletContainer = ({
  walletDetails,
  isActive,
  accounts,
}: {
  activeAccountId?: string;
  walletDetails: WalletDetails;
  isActive: boolean;
  accounts: PrimaryAccount[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Stack sx={{ pt: 0.75, width: 1 }}>
      <WalletHeader
        walletDetails={walletDetails}
        isActive={isActive}
        isExpanded={isExpanded}
        toggle={() => setIsExpanded((e) => !e)}
      />
      <Collapse timeout={200} in={isExpanded}>
        <Stack sx={{ width: 1, gap: 1, px: 2 }}>
          {accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              selectionMode={
                walletDetails.type === SecretType.Seedless
                  ? SelectionMode.None
                  : SelectionMode.Consecutive
              }
              walletType={walletDetails?.type}
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
