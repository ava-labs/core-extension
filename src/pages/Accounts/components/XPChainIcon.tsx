import {
  AvalancheColorIcon,
  Avatar,
  Badge,
  Stack,
} from '@avalabs/k2-components';

export const XPChainIcon = () => (
  <Badge
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    badgeContent={
      <Stack direction="row" sx={{ fontSize: '8px' }}>
        <Avatar
          sx={{
            backgroundColor: '#059E93',
            border: '1px solid',
            borderColor: '#353538',
            width: '12px',
            height: '12px',
            boxShadow: 'none',
          }}
        >
          X
        </Avatar>
        <Avatar
          sx={{
            backgroundColor: '#5400FF',
            border: '1px solid',
            borderColor: '#353538',
            width: '12px',
            height: '12px',
            boxShadow: 'none',
            ml: -0.4,
          }}
        >
          P
        </Avatar>
      </Stack>
    }
  >
    <AvalancheColorIcon size={16} />
  </Badge>
);
