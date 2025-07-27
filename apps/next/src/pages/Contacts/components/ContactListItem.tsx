import { Contact } from '@avalabs/types';
import {
  AvatarHex,
  ChevronRightIcon,
  IconButton,
  Stack,
  StackProps,
  Typography,
  styled,
} from '@avalabs/k2-alpine';

type ContactListItemProps = Omit<StackProps, 'children'> & {
  contact: Contact;
};

export const ContactListItem = ({
  contact,
  ...props
}: ContactListItemProps) => (
  <Wrapper role="button" {...props}>
    <AvatarHex size="xsmall" alt={contact.name} />
    <Stack
      gap={0.5}
      flexGrow={1}
      maxWidth="calc(100% - 88px)"
      sx={{ cursor: 'pointer' }}
    >
      <Typography variant="subtitle1" color="text.primary">
        {contact.name}
      </Typography>
      <Typography
        variant="mono"
        color="text.secondary"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {/* Show the first address that is not empty */}
        {contact.address ||
          contact.addressXP ||
          contact.addressBTC ||
          contact.addressSVM}
      </Typography>
    </Stack>
    <IconButton size="small" sx={{ color: 'currentColor' }}>
      <ChevronRightIcon size={20} />
    </IconButton>
  </Wrapper>
);

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
