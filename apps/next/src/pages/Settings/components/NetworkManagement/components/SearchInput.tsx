import { SearchInput as K2SearchInput, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type SearchInputProps = {
  filter: string;
  setFilter: (filter: string) => void;
};
export const SearchInput = ({ filter, setFilter }: SearchInputProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <K2SearchInput
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={t('Search')}
      sx={{
        borderRadius: '18px',
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.surface.primary
            : theme.palette.background.paper,
      }}
    />
  );
};
