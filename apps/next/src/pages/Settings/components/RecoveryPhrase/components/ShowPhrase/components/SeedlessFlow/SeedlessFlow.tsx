import { Page } from '@/components/Page';
import { StackProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const SeedlessFlow: FC = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t('Recovery phrase')}
      description={t(
        'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
      )}
      contentProps={contentProps}
    >
      Under construction
    </Page>
  );
};
