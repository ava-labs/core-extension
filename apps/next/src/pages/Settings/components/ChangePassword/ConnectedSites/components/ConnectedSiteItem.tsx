import {
  Avatar,
  Button,
  ListItem,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ConnectedSite {
  domain: string;
  name?: string;
  icon?: string;
}

interface ConnectedSiteItemProps {
  site: ConnectedSite;
  onDisconnect: () => void;
}

export const ConnectedSiteItem: FC<ConnectedSiteItemProps> = ({
  site,
  onDisconnect,
}) => {
  const { t } = useTranslation();

  const displayName = site.name || site.domain;
  const shortDomain = site.domain.replace(/^https?:\/\//, '');

  return (
    <StyledListItem>
      <Stack direction="row" alignItems="center" gap={1.5} flexGrow={1}>
        <Avatar
          src={site.icon}
          alt={displayName}
          sx={{ width: 40, height: 40 }}
        >
          {!site.icon && displayName.charAt(0).toUpperCase()}
        </Avatar>

        <Stack flexGrow={1} minWidth={0}>
          <Typography variant="subtitle2" fontWeight="600" noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {shortDomain}
          </Typography>
        </Stack>
      </Stack>

      <Button
        variant="outlined"
        size="small"
        color="secondary"
        onClick={onDisconnect}
        sx={{ minWidth: 'auto', px: 2 }}
      >
        {t('Disconnect')}
      </Button>
    </StyledListItem>
  );
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));
