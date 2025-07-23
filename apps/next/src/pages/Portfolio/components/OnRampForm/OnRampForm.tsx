import {
  Box,
  ChevronRightIcon,
  List,
  ListItemText,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSwapHoriz } from 'react-icons/md';
import * as Styled from './components/Styled';

export const OnRampForm: FC = () => {
  const { t } = useTranslation();

  return (
    <Styled.Root>
      <Box display="flex" flexBasis="180px" pl={2} pr={8.25} alignItems="end">
        <AvaGradient />
        <Typography variant="h3">
          {t('Get started by adding crypto to your wallet')}
        </Typography>
      </Box>
      <Box marginBlock="auto">
        <List disablePadding>
          <Styled.ListItemButton>
            <Styled.ListItemStartIcon>
              <MdAdd size={19.2} />
            </Styled.ListItemStartIcon>
            <ListItemText
              primary={t('Buy crypto')}
              secondary={t(
                'Buy tokens such as AVAX with a debit card or your bank account',
              )}
              slotProps={{
                primary: {
                  variant: 'subtitle2',
                },
                secondary: {
                  variant: 'caption',
                },
              }}
            />
            <Styled.ListItemEndIcon>
              <ChevronRightIcon size={22} />
            </Styled.ListItemEndIcon>
          </Styled.ListItemButton>
          <Styled.Divider variant="inset" />
          <Styled.ListItemButton>
            <Styled.ListItemStartIcon>
              <MdSwapHoriz size={19.2} />
            </Styled.ListItemStartIcon>
            <ListItemText
              primary="Transfer crypto"
              secondary="Move funds from another wallet or exchange"
              slotProps={{
                primary: {
                  variant: 'body2',
                  fontWeight: 500,
                },
                secondary: {
                  variant: 'caption',
                },
              }}
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

export default OnRampForm;
