import { Page } from '@/components/Page';
import {
  IconButton,
  Stack,
  StackProps,
  Switch,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import * as Styled from './Styled';
import { TokenSwitchList } from './components/TokenSwitchList';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const ManageTokens: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const [hideSpamTokens, setHideSpamTokens] = useState(true);
  const [query, setQuery] = useState('');
  return (
    <Page
      title={t('Manage Tokens')}
      titleAction={
        <IconButton
          size="medium"
          sx={{ padding: 0 }}
          onClick={() => push('/manage-tokens/add-custom')}
        >
          <MdAdd size={24} />
        </IconButton>
      }
      contentProps={contentProps}
    >
      <Styled.SearchInput
        placeholder={t('Search')}
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Typography variant="body3">
          {t('Hide tokens flagged as spam')}
        </Typography>
        <Switch
          size="small"
          checked={hideSpamTokens}
          onChange={(_, checked) => setHideSpamTokens(checked)}
        />
      </Stack>
      <TokenSwitchList filter={query} spam={!hideSpamTokens} />
    </Page>
  );
};
