import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import {
  Box,
  Button,
  getHexAlpha,
  Slide,
  Stack,
  styled,
} from '@avalabs/k2-alpine';
import { useAccountManager } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const BulkDeleteButtons: FC = () => {
  const { t } = useTranslation();
  const { isManageMode, toggleManageMode, exitManageMode, selectedAccounts } =
    useAccountManager();
  const [showButtons, setShowButtons] = useState(isManageMode);
  const { push } = useHistory();

  return (
    <BulkDeleteButtonsContainer
      sx={{ height: isManageMode ? '122px' : '75px' }}
    >
      {!isManageMode && (
        <Box mx="auto" marginTop="auto">
          <Button
            variant="contained"
            size="xsmall"
            color="secondary"
            onClick={() => {
              toggleManageMode();
              setShowButtons(true);
            }}
          >
            {t('Manage wallets')}
          </Button>
        </Box>
      )}
      <Slide
        direction="up"
        in={isManageMode && showButtons}
        mountOnEnter
        unmountOnExit
        onExited={() => exitManageMode()}
      >
        <Stack direction="column" gap={1} marginTop="auto">
          <Button
            variant="contained"
            color="primary"
            size="extension"
            fullWidth
            disabled={selectedAccounts.length === 0}
            onClick={() => {
              const params = new URLSearchParams(
                selectedAccounts.map((id) => [URL_SEARCH_TOKENS.account, id]),
              );
              params.set(URL_SEARCH_TOKENS.bulkMode, 'true');
              push({
                pathname: '/account-management/delete-account',
                search: params.toString(),
              });
            }}
          >
            {t('Delete selected')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            fullWidth
            onClick={() => setShowButtons(false)}
          >
            {t('Cancel')}
          </Button>
        </Stack>
      </Slide>
    </BulkDeleteButtonsContainer>
  );
};

const BulkDeleteButtonsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1.5),
  marginLeft: `-${theme.spacing(2)}`,
  paddingInline: theme.spacing(2),
  marginRight: `-${theme.spacing(2)}`,
  marginBottom: `-${theme.spacing(1.5)}`,
  background: `linear-gradient(180deg, ${getHexAlpha(theme.palette.background.paper, 0)} 0%, ${theme.palette.background.paper} 42%)`,

  '> div': {
    borderRadius: theme.shape.mediumBorderRadius,
    background: theme.palette.background.paper,
  },
}));
