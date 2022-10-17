import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { t } from 'i18next';

interface TokenSearchProps {
  query: string;
  onBack: () => void;
  onSearch: (string) => void;
  className?: string;
}

const StyledTextButton = styled(TextButton)`
  position: absolute;
  left: 0;
`;

export function TokenSearch({
  query,
  onBack,
  onSearch,
  className,
}: TokenSearchProps) {
  const theme = useTheme();

  return (
    <VerticalFlex
      width={'100%'}
      padding="12px 16px 16px"
      align={'center'}
      className={className}
    >
      <HorizontalFlex
        width={'100%'}
        justify={'center'}
        align="center"
        position="relative"
      >
        <StyledTextButton
          onClick={() => {
            onBack();
          }}
        >
          <CaretIcon
            color={theme.colors.icon1}
            direction={IconDirection.LEFT}
          />
        </StyledTextButton>
        <Typography as="h1" size={24} height="29px" weight={700}>
          {t('Send')}
        </Typography>
      </HorizontalFlex>
      <Typography height="24px" margin="8px 0 32px">
        {t('Choose asset to continue')}
      </Typography>
      <SearchInput
        searchTerm={query}
        placeholder={t('Search')}
        width="343px"
        onSearch={(query) => onSearch(query)}
        autoFocus={true}
      />
    </VerticalFlex>
  );
}
