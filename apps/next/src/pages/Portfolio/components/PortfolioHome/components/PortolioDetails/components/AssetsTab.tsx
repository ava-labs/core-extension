import { Box, Button, Stack, toast } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCurrencyBitcoin, MdKeyboardArrowDown } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { UnderConstruction } from './UnderConstruction';

export const AssetsTab: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  return (
    <Stack direction="column" gap={1.25} height={1}>
      <Box height={40} bgcolor="background.paper" borderRadius={2} px={2}>
        Trending tokens placeholder
      </Box>
      <Stack direction="row" gap={1.25}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<MdKeyboardArrowDown />}
          onClick={() => toast.info('Coming soon')}
        >
          {t('Filter')}
        </Button>
        <Button
          variant="outlined"
          size="small"
          endIcon={<MdKeyboardArrowDown />}
          onClick={() => toast.info('Coming soon')}
        >
          {t('Sort')}
        </Button>
        <Box ml="auto">
          <Button
            variant="outlined"
            size="small"
            onClick={() => push('/manage-tokens')}
          >
            {t('Manage')}
          </Button>
        </Box>
      </Stack>
      <UnderConstruction
        title="Assets"
        description="Your assets will be displayed here. We're working hard to bring you this feature soon!"
        icon={<MdCurrencyBitcoin size={24} />}
      />
    </Stack>
  );
};
