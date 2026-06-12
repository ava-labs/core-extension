import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  ChevronRightIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { MdOutlineRotateRight } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { Card } from '@/components/Card';
import { getRecurringSwapsPath } from '@/config/routes';

type RecurringSwapsEntryCardProps = {
  scheduledCount: number;
  // 'manage' shows a trailing "Manage" button (swap form); 'navigate' makes
  // the whole row tappable with a trailing chevron (portfolio).
  action?: 'manage' | 'navigate';
};

const ROW_HEIGHT = 48;

export const RecurringSwapsEntryCard = ({
  scheduledCount,
  action = 'navigate',
}: RecurringSwapsEntryCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { push } = useHistory();

  const goToRecurringSwaps = useCallback(() => {
    push(getRecurringSwapsPath());
  }, [push]);

  const isNavigable = action === 'navigate';

  return (
    <Card
      noPadding
      onClick={isNavigable ? goToRecurringSwaps : undefined}
      sx={{
        width: '100%',
        borderRadius: 2,
        // The portfolio (navigate) variant sits on a lighter surface and needs
        // an explicit fill; the swap-form (manage) variant inherits the default
        // Card background so it matches the surrounding swap cards.
        ...(isNavigable && {
          backgroundColor: 'background.paper',
          cursor: 'pointer',
        }),
      }}
      data-testid="recurring-swaps-entry"
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1.25}
        height={ROW_HEIGHT}
        pl={1.5}
        pr={1}
        width="100%"
      >
        <Box sx={{ lineHeight: 1, height: 24 }}>
          <MdOutlineRotateRight size={24} />
        </Box>
        <Stack flexGrow={1} minWidth={0}>
          <Typography variant="subtitle3" color="text.primary" lineHeight={1.1}>
            {t('Recurring swaps')}
          </Typography>
          <Typography variant="body3" color="text.primary" lineHeight={1.1}>
            {t('{{count}} scheduled', { count: scheduledCount })}
          </Typography>
        </Stack>
        {action === 'manage' ? (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={goToRecurringSwaps}
            data-testid="recurring-swaps-manage-button"
          >
            {t('Manage')}
          </Button>
        ) : (
          <ChevronRightIcon
            size={20}
            color={theme.palette.text.secondary}
            sx={{ flexShrink: 0 }}
          />
        )}
      </Stack>
    </Card>
  );
};
