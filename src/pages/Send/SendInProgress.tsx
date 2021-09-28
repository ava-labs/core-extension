import React from 'react';
import { Modal } from '@src/components/common/Modal';
import {
  LoadingIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';

export function SendInProgress({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={isOpen}>
      <VerticalFlex
        height={'100%'}
        width={'100%'}
        align={'center'}
        justify={'center'}
      >
        <img
          height={'100px'}
          src={
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Creative-Tail-rocket.svg/1200px-Creative-Tail-rocket.svg.png'
          }
        />
        <br />
        <br />
        <Typography>Transaction in progress</Typography>
        <br />
        <LoadingIcon height={'20px'} />
      </VerticalFlex>
    </Modal>
  );
}
