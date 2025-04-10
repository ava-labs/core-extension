import { useApproveAction } from '@src/hooks/useApproveAction';
import { ActionStatus } from 'packages/service-worker/src/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { ContactInfo } from '@src/components/settings/components/ContactInfo';
import { Contact } from '@avalabs/types';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CircularProgress,
  ContactsIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { SiteAvatar } from '@src/components/common/SiteAvatar';

export function UpdateContacts({
  method,
}: {
  method: 'create' | 'update' | 'remove';
}) {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction<{ contact: Contact; existing?: Contact }>(requestId);

  if (!action) {
    return (
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  const translatedMethod = {
    create: t('Create'),
    update: t('Update'),
    remove: t('Remove'),
  };

  return (
    <Stack sx={{ py: 1, px: 2, width: 1, height: 1 }}>
      <Stack
        sx={{
          height: 1,
          width: 1,
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SiteAvatar sx={{ mb: 3 }}>
          <ContactsIcon size={48} />
        </SiteAvatar>
        <Typography sx={{ pb: 2 }} variant="h4">
          {translatedMethod[method]} {t('Contact?')}
        </Typography>
        <Typography
          sx={{ textAlign: 'center', maxWidth: 1, wordWrap: 'break-word' }}
          variant="body1"
        >
          <Trans
            i18nKey={'{{domain}} is requesting to {{method}} a contact:'}
            values={{
              domain: action.site?.domain || t('This website'),
              method: translatedMethod[method].toLowerCase(),
            }}
          />
        </Typography>

        <Stack
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: 1,
            mt: 3,
          }}
        >
          {method === 'update' && action.displayData?.existing ? (
            <>
              <Typography variant="body1">{t('From:')}</Typography>
              <Card
                sx={{
                  width: 1,
                  p: 2,
                }}
              >
                <ContactInfo contact={action.displayData?.existing} />
              </Card>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {t('To:')}
              </Typography>
              <Card
                sx={{
                  width: 1,
                  p: 2,
                }}
              >
                <ContactInfo contact={action.displayData?.contact} />
              </Card>
            </>
          ) : (
            <ContactInfo contact={action.displayData?.contact} />
          )}
        </Stack>
      </Stack>

      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          width: '100%',
          justifyContent: 'space-between',
          pt: 3,
          pb: 1,
          gap: 1,
        }}
      >
        <Button
          color="secondary"
          data-testid="transaction-reject-btn"
          size="large"
          fullWidth
          disabled={action.status === ActionStatus.SUBMITTING}
          onClick={() => {
            cancelHandler();
            window.close();
          }}
        >
          {t('Reject')}
        </Button>
        <Button
          data-testid="transaction-approve-btn"
          size="large"
          fullWidth
          disabled={action.status === ActionStatus.SUBMITTING || !!action.error}
          onClick={() => {
            updateMessage({
              status: ActionStatus.SUBMITTING,
              id: requestId,
            });
          }}
        >
          {t('Approve')}
        </Button>
      </Stack>
    </Stack>
  );
}
