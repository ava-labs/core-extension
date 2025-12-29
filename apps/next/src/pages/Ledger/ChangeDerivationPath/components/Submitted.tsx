import { ConfettiProvider, useConfettiContext } from '@/components/Confetti';
import { Stack } from '@avalabs/k2-alpine';

import { FC, useEffect } from 'react';
import { MdCheckCircle } from 'react-icons/md';

const Submitted: FC = () => {
  const { triggerConfetti } = useConfettiContext();
  useEffect(triggerConfetti, [triggerConfetti]);
  return (
    <Stack
      height={1}
      gap={2}
      alignItems="center"
      justifyContent="center"
      color="success.main"
    >
      <MdCheckCircle size={72} />
    </Stack>
  );
};

const ConfettiSubmitted: FC = () => (
  <ConfettiProvider>
    <Submitted />
  </ConfettiProvider>
);

export { ConfettiSubmitted as Submitted };
