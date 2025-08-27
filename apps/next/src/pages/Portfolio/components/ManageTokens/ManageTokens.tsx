import { Page } from '@/components/Page';
import { Stack, StackProps, Switch, Typography } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [hideSpamTokens, setHideSpamTokens] = useState(false);
  const [query, setQuery] = useState('');
  return (
    <Page title={t('Manage Tokens')} contentProps={contentProps}>
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
