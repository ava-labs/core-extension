import { CORE_WEB_BASE_URL } from '@/config/constants';
import {
  Box,
  ChevronRightIcon,
  List,
  ListItemText,
  ListItemTextProps,
  Stack,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSwapHoriz } from 'react-icons/md';
import { AvaGradient } from './components/AvaGradient';
import * as Styled from './components/Styled';

const navigateToBuyPage = () => {
  window.open(`${CORE_WEB_BASE_URL}/buy`, '_blank');
};

const optionSlotProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'subtitle4',
  },
  secondary: {
    variant: 'caption',
  },
};

export const EmptyState: FC = () => {
  const { t } = useTranslation();

  return (
    <Styled.Root>
      <Stack
        direction="column"
        flexBasis="180px"
        gap={1.25}
        pr={8.25}
        alignItems="end"
      >
        <AvaGradient />
        <Box pl={2}>
          <Typography variant="h3">
            {t('Get started by adding crypto to your wallet')}
          </Typography>
        </Box>
      </Stack>
      <Box marginBlock="auto">
        <List disablePadding>
          <Styled.ListItemButton onClick={navigateToBuyPage}>
            <Styled.ListItemStartIcon>
              <MdAdd size={19.2} />
            </Styled.ListItemStartIcon>
            <ListItemText
              primary={t('Buy crypto')}
              secondary={t(
                'Buy tokens such as AVAX with a debit card or your bank account',
              )}
              slotProps={optionSlotProps}
            />
            <Styled.ListItemEndIcon>
              <ChevronRightIcon size={22} />
            </Styled.ListItemEndIcon>
          </Styled.ListItemButton>
          <Styled.Divider variant="inset" />
          <Styled.ListItemButton
            onClick={() => {
              toast.info('Coming soon');
            }}
          >
            <Styled.ListItemStartIcon>
              <MdSwapHoriz size={19.2} />
            </Styled.ListItemStartIcon>
            <ListItemText
              primary={t('Transfer crypto')}
              secondary={t('Move funds from another wallet or exchange')}
              slotProps={optionSlotProps}
            />
            <Styled.ListItemEndIcon>
              <ChevronRightIcon size={22} />
            </Styled.ListItemEndIcon>
          </Styled.ListItemButton>
        </List>
      </Box>
    </Styled.Root>
  );
};
