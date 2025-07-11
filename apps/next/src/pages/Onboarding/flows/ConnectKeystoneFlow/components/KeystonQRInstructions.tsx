import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Stack, styled, Typography } from '@avalabs/k2-alpine';

import { CardMenu } from '@/pages/Onboarding/components/CardMenu';

type KeystoneQRInstructionsProps = {
  onScan: () => void;
};

export const KeystoneQRInstructions: FC<KeystoneQRInstructionsProps> = ({
  onScan,
}) => {
  const { t } = useTranslation();

  return (
    <CardMenu
      sx={{
        width: 1,
        my: 0,
        flex: '0 0 auto',
        py: 2,
      }}
      component="ol"
      divider={<StyledDivider />}
    >
      <Item>
        <Typography variant="body2">
          {t('Select “Core Wallet” in the menu on your Keystone device.')}
        </Typography>
      </Item>
      <Item>
        <Typography variant="body2">
          {t('Select “Connect” in the top right corner of the screen.')}
        </Typography>
      </Item>
      <Item sx={{ pt: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          pr={2}
        >
          <Typography variant="body2">
            {t('Scan the QR code shown on your device')}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={onScan}
          >
            {t('Scan now')}
          </Button>
        </Stack>
      </Item>
    </CardMenu>
  );
};

const Item = styled('li')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingBlock: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(0),
  },
  '&:first-child': {
    paddingTop: theme.spacing(0),
  },
  '::marker': { color: theme.palette.text.secondary },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(0),
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(2),
}));
