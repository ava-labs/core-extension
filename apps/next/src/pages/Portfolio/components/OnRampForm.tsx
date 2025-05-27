import {
  Stack,
  Typography,
  List,
  ListItemButton as MuiListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  ChevronRightIcon,
  styled,
  getHexAlpha,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdAdd, MdSwapHoriz } from 'react-icons/md';

const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  padding: 0,
  gap: theme.spacing(1.5),
}));

const ListItemStartIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: 1,
  borderRadius: '30px',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
  color: theme.palette.text.primary,
}));

const ListItemEndIcon = styled(ListItemIcon)({
  justifyContent: 'flex-end',
});

export const OnRampForm: FC = () => {
  return (
    <Stack
      flexGrow={1}
      mt={3}
      mb={2}
      pt="22px"
      px={2}
      spacing={2}
      borderRadius="12px"
      bgcolor="surface.secondary"
    >
      <Typography variant="h2">
        Let&apos;s get <br /> you all set up
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        style={{ marginTop: '2px' }}
      >
        Your crypto journey starts now
      </Typography>
      <List disablePadding>
        <ListItemButton>
          <ListItemStartIcon>
            <MdAdd size={19.2} />
          </ListItemStartIcon>
          <ListItemText
            primary="Buy crypto"
            secondary="Buy tokens with a debit card or your bank account"
            slotProps={{
              primary: {
                variant: 'body2',
                fontWeight: 500,
              },
              secondary: {
                variant: 'caption',
              },
            }}
          />
          <ListItemEndIcon>
            <ChevronRightIcon size={19.2} />
          </ListItemEndIcon>
        </ListItemButton>
        <Divider variant="inset" />
        <ListItemButton>
          <ListItemStartIcon>
            <MdSwapHoriz size={19.2} />
          </ListItemStartIcon>
          <ListItemText
            primary="Transfer crypto"
            secondary="Move funds from another wallet or exchange"
            slotProps={{
              primary: {
                variant: 'body2',
                fontWeight: 500,
              },
              secondary: {
                variant: 'caption',
              },
            }}
          />
          <ListItemEndIcon>
            <ChevronRightIcon size={19.2} />
          </ListItemEndIcon>
        </ListItemButton>
      </List>
    </Stack>
  );
};

export default OnRampForm;
