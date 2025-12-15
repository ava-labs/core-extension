import { FaQuestion } from 'react-icons/fa6';
import { AvatarHex, Box } from '@avalabs/k2-alpine';
import { HexagonalIcon } from '@/components/HexagonalIcon';
import { Recipient } from '../types';

type RecipientIconProps = {
  recipient: Recipient;
};

export const RecipientIcon = ({ recipient }: RecipientIconProps) => {
  switch (recipient.type) {
    case 'account': {
      return (
        <HexagonalIcon size={36}>
          {/* Blank icon until we get the avatars assigned to each account */}
        </HexagonalIcon>
      );
    }
    case 'contact':
      return <AvatarHex size="xsmall" alt={recipient.contact.name} />;
    default:
      return (
        <HexagonalIcon size={36}>
          <Box display="flex" color="text.secondary">
            <FaQuestion />
          </Box>
        </HexagonalIcon>
      );
  }
};
