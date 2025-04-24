import React from 'react';
import type { Contact } from '@avalabs/types';
import {
  Stack,
  AvalancheColorIcon,
  BitcoinColorIcon,
  Avatar,
  Button,
  Typography,
  Tooltip,
  XAndPChainsIcon,
} from '@avalabs/core-k2-components';
import { ContactAddress } from './ContactAddress';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isXchainNetwork } from '@src/background/services/network/utils/isAvalancheXchainNetwork';
import { SolanaLogoIcon } from '@src/components/common/SolanaLogoIcon';

type AddressDropdownListItemProps = {
  contact: Contact;
  isSelected: boolean;
  selectedContact?: Contact;
  onChange(contact: Contact): void;
};

export const AddressDropdownListItem = ({
  contact,
  isSelected,
  onChange,
}: AddressDropdownListItemProps) => {
  const { network } = useNetworkContext();

  const initials =
    contact.name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0] ?? '') || '?';

  return (
    <Button
      variant="text"
      data-testid="send-address-list-item"
      fullWidth
      sx={{
        justifyContent: 'space-between',
        py: 2,
        gap: 2,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        maxHeight: 'none',
      }}
      color={isSelected ? 'secondary' : 'primary'}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (contact.addressXP && isPchainNetwork(network)) {
          const contactWithPrefix = {
            ...contact,
            addressXP: `P-${contact.addressXP}`,
          };
          onChange(contactWithPrefix);
        } else if (contact.addressXP && isXchainNetwork(network)) {
          const contactWithPrefix = {
            ...contact,
            addressXP: `X-${contact.addressXP}`,
          };
          onChange(contactWithPrefix);
        } else {
          onChange(contact);
        }
      }}
      disableRipple
    >
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2.5,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Avatar sx={{ width: 32, height: 32 }} alt={contact.name} useColor>
          {initials}
        </Avatar>
        <Tooltip title={contact.name} wrapWithSpan={false} disableInteractive>
          <Typography
            noWrap
            variant="body1"
            component="span"
            sx={{
              fontWeight: 'semibold',
            }}
            color="inherit"
          >
            {contact.name}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack sx={{ gap: 0.5 }}>
        {contact.address && (
          <ContactAddress
            address={contact.address}
            networkIcon={<AvalancheColorIcon size={16} />}
          />
        )}
        {contact.addressBTC && (
          <ContactAddress
            address={contact.addressBTC}
            networkIcon={<BitcoinColorIcon size={16} />}
          />
        )}
        {contact.addressXP && (
          <ContactAddress
            address={
              isPchainNetwork(network)
                ? `P-${contact.addressXP}`
                : `X-${contact.addressXP}`
            }
            networkIcon={<XAndPChainsIcon size={16} />}
          />
        )}
        {contact.addressSVM && (
          <ContactAddress
            address={contact.addressSVM}
            networkIcon={<SolanaLogoIcon size={16} />}
          />
        )}
      </Stack>
    </Button>
  );
};
