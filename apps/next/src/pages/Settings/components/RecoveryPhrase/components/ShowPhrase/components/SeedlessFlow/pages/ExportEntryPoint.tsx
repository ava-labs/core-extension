import { ActionButtons } from '@/components/ActionButtons';
import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import { StackProps, styled } from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { StageProps } from '../types';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

const ExternalLinkIcon = styled(FiExternalLink)(({ theme }) => ({
  marginLeft: theme.spacing(-1.5),
}));

export const ExportEntryPoint: FC<StageProps> = ({
  initExport,
  fullscreen: isFullscreen,
}) => {
  const { t } = useTranslation();
  const {
    push,
    location: { pathname },
  } = useHistory();

  useEffect(() => {
    if (isFullscreen) {
      initExport();
    }
  }, [initExport, isFullscreen]);

  const goToSettings = () => {
    push('/settings');
  };

  return (
    <Page
      title={t('There is a waiting period to view your recovery phrase')}
      description={t(
        'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
      )}
      contentProps={contentProps}
    >
      <WarningMessage>
        {t(
          'It will take 2 days to retrieve your recovery phrase. You will only have 48 hours to copy your recovery phrase once the 2 day waiting period is over',
        )}
      </WarningMessage>
      <ActionButtons
        top={{
          label: t('Next'),
          endIcon: <ExternalLinkIcon />,
          onClick: async () => {
            if (!isFullscreen) {
              openFullscreenTab(pathname.slice(1));
              window.close();
            }
          },
          color: 'primary',
        }}
        bottom={{
          label: t('Cancel'),
          onClick: goToSettings,
          color: 'secondary',
        }}
      />
    </Page>
  );
};
