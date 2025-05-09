import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CopyIcon,
  IconButton,
  Scrollbars,
  Stack,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle, PageTitleVariant } from '@/components/common/PageTitle';
import { Overlay } from '@/components/common/Overlay';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';

export const BlockchainGenesisFile = ({ onClose, data }) => {
  const { t } = useTranslation();

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(data);
    toast.success(t('Copied!'), { duration: 1000 });
  }, [data, t]);

  return (
    <Overlay isBackgroundFilled>
      <Stack sx={{ height: '100%', width: '100%' }}>
        <PageTitle
          variant={PageTitleVariant.PRIMARY}
          onBackClick={onClose}
          margin="0"
        >
          {t('Genesis Information')}
        </PageTitle>
        <Stack sx={{ p: 2, flexGrow: 1 }}>
          <ApprovalSection sx={{ flexGrow: 1 }}>
            <ApprovalSectionHeader label={t('Code')}>
              <IconButton
                size="small"
                data-testid="copy-genesis-information"
                onClick={handleCopyClick}
              >
                <CopyIcon />
              </IconButton>
            </ApprovalSectionHeader>
            <ApprovalSectionBody sx={{ flexGrow: 1 }}>
              <Scrollbars>
                <Typography component="pre" variant="caption" monospace>
                  {data}
                </Typography>
              </Scrollbars>
            </ApprovalSectionBody>
          </ApprovalSection>
        </Stack>
      </Stack>
    </Overlay>
  );
};
