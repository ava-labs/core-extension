import { PersonalAvatar } from '@/components/PersonalAvatar';
import {
  ChevronRightIcon,
  IconButton,
  Stack,
  StackProps,
  Typography,
  styled,
} from '@avalabs/k2-alpine';
import { Contact } from '@avalabs/types';
import { useTranslation } from 'react-i18next';

type ContactListItemProps = Omit<StackProps, 'children'> & {
  contact: Contact;
};

export const ContactListItem = ({
  contact,
  ...props
}: ContactListItemProps) => {
  const { t } = useTranslation();

  // Show the first address that is not empty
  const address =
    contact.address ||
    contact.addressXP ||
    contact.addressBTC ||
    contact.addressSVM;

  return (
    <Wrapper role="button" data-testid="contact-item" {...props}>
      <PersonalAvatar
        dataUri={contact.avatar ?? ''}
        size="xsmall"
        alt={contact.name}
      />
      <Stack
        gap={0.5}
        flexGrow={1}
        maxWidth="calc(100% - 88px)"
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant="subtitle3" color="text.primary">
          {contact.name}
        </Typography>
        <Typography
          variant="mono2"
          color="text.secondary"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          fontStyle={address ? 'normal' : 'italic'}
        >
          {address || t('No address')}
        </Typography>
      </Stack>
      <IconButton size="small" sx={{ color: 'currentColor' }}>
        <ChevronRightIcon size={20} />
      </IconButton>
    </Wrapper>
  );
};

const Wrapper = styled(Stack)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(0.5),
  gap: theme.spacing(1),
  color: 'text.secondary',
  flexDirection: 'row',
  alignItems: 'center',
  transition: theme.transitions.create('color'),
  '&:hover': { color: 'text.primary' },
}));
