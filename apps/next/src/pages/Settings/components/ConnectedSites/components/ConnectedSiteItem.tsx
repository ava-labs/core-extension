import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectedSite } from '../hooks/useConnectedSites';
import { isFaviconExists } from '../utils/favicon';
import * as Styled from './Styled';

interface ConnectedSiteItemProps {
  site: ConnectedSite;
  onDisconnect: VoidFunction;
}

export const ConnectedSiteItem: FC<ConnectedSiteItemProps> = ({
  site,
  onDisconnect,
}) => {
  const { t } = useTranslation();
  const [isIconExists, setIsIconExists] = useState(false);

  // TODO: Get domain's title from somewhere
  const displayName = site.domain;

  useEffect(() => {
    isFaviconExists(site.domain).then(setIsIconExists);
  }, [site.domain]);

  return (
    <Styled.ListItem>
      <Styled.Avatar
        src={isIconExists ? site.favicon : undefined}
        alt={displayName}
        error={!isIconExists}
      >
        {!isIconExists && <>&nbsp;</>}
      </Styled.Avatar>

      <Stack minWidth={0}>
        <Typography variant="subtitle2" fontWeight="600" noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {site.domain}
        </Typography>
      </Stack>

      <Styled.DisconnectButton
        size="small"
        variant="contained"
        color="secondary"
        onClick={onDisconnect}
      >
        {t('Disconnect')}
      </Styled.DisconnectButton>
    </Styled.ListItem>
  );
};
