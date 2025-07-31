import { AvatarRows } from '@/components/Avatar/AvatarRows';
import { Page } from '@/components/Page';
import {
  AVATAR_OPTIONS,
  PersonalAvatar,
  PersonalAvatarName,
  usePersonalAvatar,
} from '@/components/PersonalAvatar';
import { Box, getHexAlpha, useTheme } from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AvatarSelector = () => {
  const { t } = useTranslation();
  const { saveAvatar, selected } = usePersonalAvatar();
  const { name: selectedAvatarName } = selected;

  const theme = useTheme();

  const [selectedAvatar, setSelectedAvatar] =
    useState<PersonalAvatarName>(selectedAvatarName);

  const handleSelectAvatar = (newSelected: PersonalAvatarName) => {
    setSelectedAvatar(newSelected);
    saveAvatar(newSelected);
  };

  const row1 = AVATAR_OPTIONS.filter((_, index) => index % 2 === 0);
  const row2 = AVATAR_OPTIONS.filter((_, index) => index % 2 !== 0);
  const rows = [row1, row2];

  return (
    <Page
      title={t('Select your personal avatar')}
      withBackButton
      contentProps={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
    >
      <PersonalAvatar cached size="xsmall" sx={{ mr: 1 }} />

      <Box
        sx={{
          height: '170px',
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          border: 1,
          borderLeft: 0,
          borderRight: 0,
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
