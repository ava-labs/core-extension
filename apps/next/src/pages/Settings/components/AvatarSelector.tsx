import { AvatarRows } from '@/components/Avatar/AvatarRows';
import { Page } from '@/components/Page';
import {
  AVATAR_OPTIONS,
  PersonalAvatar,
  PersonalAvatarName,
  usePersonalAvatar,
} from '@/components/PersonalAvatar';
import { Box, getHexAlpha, Stack, useTheme } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const row1 = AVATAR_OPTIONS.filter((_, index) => index % 2 === 0);
const row2 = AVATAR_OPTIONS.filter((_, index) => index % 2 !== 0);
const rows = [row1, row2];

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
          avatarRows={rows}
          selected={selectedAvatar}
          onSelect={handleSelectAvatar}
        />
      </Box>
    </Page>
  );
};
