import { useApproveAction } from '@src/hooks/useApproveAction';
import { Action, ActionStatus } from '@src/background/services/actions/models';
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
} from '@avalabs/k2-components';
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
  } = useApproveAction(requestId);

  const request = action as Action & {
    displayData: { contact: Contact; existing?: Contact };
  };

  if (!request) {
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
        <Typography sx={{ textAlign: 'center' }} variant="body1">
          <Trans
            i18nKey={'{{domain}} is requesting to <br/>{{method}} a contact:'}
            values={{
              domain: request.site?.domain || t('This website'),
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
          {method === 'update' && request.displayData?.existing ? (
            <>
              <Typography variant="body1">{t('From:')}</Typography>
              <Card
                sx={{
                  width: 1,
                  p: 2,
                }}
              >
                <ContactInfo contact={request.displayData?.existing} />
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
                <ContactInfo contact={request.displayData?.contact} />
              </Card>
            </>
          ) : (
            <ContactInfo contact={request.displayData?.contact} />
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
          disabled={request.status === ActionStatus.SUBMITTING}
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
          disabled={
            request.status === ActionStatus.SUBMITTING || !!request.error
          }
          onClick={() => {
            updateMessage({
              status: ActionStatus.SUBMITTING,
              id: request.id,
            });
          }}
        >
          {t('Approve')}
        </Button>
      </Stack>
    </Stack>
  );
}
