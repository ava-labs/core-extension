import { Button, Slide, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { useCallback } from 'react';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';
import { Card } from '@/components/Card';

export const GenericApprovalScreen = () => {
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);

  // TODO: handle gasless
  const approve = useCallback(() => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      false, // TODO: handle hardware wallets
    );
  }, [updateAction, requestId]);

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
      pt={3}
    >
      <Stack px={2}>
        <Typography variant="h2">Do you approve this transaction?</Typography>
      </Stack>

      <NoScrollStack gap={1.25} px={2} pb={3}>
        <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
          <Typography variant="body3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
            mi in arcu consequat sagittis. Phasellus porttitor odio nec mi
            eleifend, vitae convallis arcu vulputate. Integer ac dolor
            facilisis, condimentum elit suscipit, finibus nulla. Nullam eleifend
            purus a magna aliquam euismod. Ut et interdum diam. Donec sit amet
            tincidunt leo. Etiam tincidunt metus urna, nec vestibulum augue
            varius non. Nulla ac mi eget ex condimentum fringilla. Aliquam a
            egestas quam. Nunc id convallis nulla. Donec mollis tincidunt tortor
            ac commodo.
          </Typography>
        </Card>
        <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
          <Typography variant="body3">
            In nec eros erat. Aliquam justo nisi, euismod eu feugiat ut,
            facilisis accumsan tortor. Integer tellus tortor, tristique in
            mauris at, efficitur lobortis turpis. Vestibulum libero dui, semper
            et lacus sit amet, ultricies maximus elit. Fusce sed risus sed dolor
            scelerisque posuere. Ut efficitur massa vel arcu pulvinar mattis.
            Nulla vitae lorem eros.
          </Typography>
        </Card>
        <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
          <Typography variant="body3">
            Nunc nunc arcu, sodales vitae sodales vel, tincidunt sit amet magna.
            Cras sagittis, lectus vehicula tincidunt mollis, elit diam venenatis
            orci, sit amet posuere est justo in nulla. Morbi nec eleifend lacus,
            non consectetur libero. Ut commodo nulla ut pretium venenatis.
            Vestibulum rhoncus orci a ante ultrices, sit amet tempus purus
            fermentum. Vestibulum diam nisi, auctor ac vestibulum eget, auctor
            eu quam. Vivamus sagittis turpis dapibus ornare malesuada.
          </Typography>
        </Card>
      </NoScrollStack>

      <Slide in={Boolean(action)} direction="up" mountOnEnter unmountOnExit>
        <Stack
          width="100%"
          pt={1}
          pb={2}
          px={2}
          gap={1}
          // TODO: only show box shadow when the buttons overlay the content
          sx={{ boxShadow: '0px -10px 20px 12px rgb(0 0 0 / 60%)' }}
        >
          <Button
            variant="contained"
            color="primary"
            size="extension"
            onClick={approve}
            disabled={!action || action.status === ActionStatus.SUBMITTING}
            loading={!action || action.status === ActionStatus.SUBMITTING}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            onClick={cancelHandler}
            disabled={!action || action.status === ActionStatus.SUBMITTING}
            loading={!action || action.status === ActionStatus.SUBMITTING}
          >
            Reject
          </Button>
        </Stack>
      </Slide>
    </Stack>
  );
};

// TODO: remove this once we have a proper scrollable component
const NoScrollStack = styled(Stack)`
  overflow: auto;
  flex-grow: 1;
  margin-top: ${({ theme }) => theme.spacing(2)};
  &::-webkit-scrollbar {
    display: none;
  }
`;
