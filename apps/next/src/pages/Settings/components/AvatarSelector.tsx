import { AVATAR_ROWS, AvatarRows } from '@/components/Avatar';
import { Page } from '@/components/Page';
import {
  PersonalAvatar,
  PersonalAvatarName,
  usePersonalAvatar,
} from '@/components/PersonalAvatar';
import { Box, getHexAlpha, Stack, useTheme } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const AvatarSelector = () => {
  const { t } = useTranslation();
  const { saveAvatar, selected } = usePersonalAvatar();
  const { replace } = useHistory();
  const { capture } = useAnalyticsContext();
  const { name: selectedAvatarName } = selected;

  const theme = useTheme();

  const [selectedAvatar, setSelectedAvatar] =
    useState<PersonalAvatarName>(selectedAvatarName);

  const handleSelectAvatar = (newSelected: PersonalAvatarName) => {
    setSelectedAvatar(newSelected);
    saveAvatar(newSelected);
    capture('AvatarSettingChanged');
    replace('/settings');
  };

  return (
    <Page
      title={t('Select your personal avatar')}
      withBackButton
      contentProps={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        flex={1}
      >
        <PersonalAvatar cached size="medium" sx={{ mr: 1 }} />
      </Stack>

      <Box
        sx={{
          height: '170px',
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          },

          borderColor: getHexAlpha(theme.palette.primary.main, 10),
          scrollBehavior: 'smooth',
          '& > *': {
            minWidth: 'max-content',
          },
        }}
      >
        <AvatarRows
          avatarRows={AVATAR_ROWS}
          selected={selectedAvatar}
          onSelect={handleSelectAvatar}
        />
      </Box>
    </Page>
  );
};
