import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import {
  MfaChoiceRequest,
  RecoveryMethod as RecoveryMethodT,
} from 'packages/service-worker/src/services/seedless/models';
import { RecoveryMethod } from '@src/components/common/seedless/components/RecoveryMethod';
import { PartialBy } from 'packages/service-worker/src/models';

type Props = {
  mfaChoice?: PartialBy<MfaChoiceRequest, 'mfaId'>;
  onChosen: (method: RecoveryMethodT) => void;
};

export const MfaChoicePrompt = ({ mfaChoice, onChosen }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={Boolean(mfaChoice)} PaperProps={{ sx: { m: 2 } }}>
      <DialogTitle>{t('Choose Verification Method')}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t(
            'Select one of the available verification methods below to proceed.',
          )}
        </Typography>
      </DialogContent>
      {mfaChoice?.availableMethods?.length && (
        <DialogActions sx={{ px: 1 }}>
          {mfaChoice.availableMethods.map((method) => (
            <RecoveryMethod
              key={method.type === 'fido' ? method.id : 'authenticator'}
              methodName={
                method.type === 'fido' ? method.name : t('Authenticator')
              }
              onClick={() => onChosen(method)}
              asCard
              sx={{
                width: 1,
                justifyContent: 'space-between',
              }}
            />
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};
