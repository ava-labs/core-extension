import { Fade, Stack, truncateAddress, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { AddressType } from '@core/types';

import {
  PersonalAvatar,
  PersonalAvatarName,
} from '@/components/PersonalAvatar';
import { getContactAddressByType } from '../../lib/getContactAddressByType';
import { ContactRecipient } from '../../types';
import { StyledMenuItem } from './StyledMenuItem';

type ContactRecipientItemProps = {
  recipient: ContactRecipient;
  addressType: AddressType;
  isSelected: boolean;
};

export const ContactRecipientItem: FC<ContactRecipientItemProps> = ({
  recipient,
  addressType,
  isSelected,
  ...rest
}) => {
  return (
    <StyledMenuItem value={recipient.id} {...rest}>
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <PersonalAvatar
          name={(recipient.contact.avatar as PersonalAvatarName) ?? ''}
          size="xsmall"
          alt={recipient.contact.name}
        />
        <Stack gap={0.25} flexGrow={1}>
          <Typography variant="body2" fontWeight="fontWeightMedium">
            {recipient.contact.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {truncateAddress(
              getContactAddressByType(recipient.contact, addressType) ?? '',
              20,
            )}
          </Typography>
        </Stack>
        <Stack position="relative" height={12}>
          <Fade in={isSelected} mountOnEnter unmountOnExit>
            <FaCheck
              className="check"
              style={{ position: 'absolute', right: 0 }}
            />
          </Fade>
        </Stack>
      </Stack>
    </StyledMenuItem>
  );
};
