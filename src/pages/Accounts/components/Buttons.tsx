import {
  KeyIcon,
  PlusIcon,
  PrimaryButton,
  SecondaryButton,
  TrashIcon,
} from '@avalabs/react-components';
import styled from 'styled-components';

// THIS SPLITTED BUTTON WILL BE USEFUL BUT WE REPLACED THEM TO PRIMARY FOR NOW
export const SplitButtonLeft = styled(PrimaryButton)`
  border-radius: 0;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  width: 286px;
`;
export const SplitButtonRight = styled(PrimaryButton)`
  border-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  width: 56px;
  padding: 18px 0;
  margin-left: 1px;
`;

export const ActionButton = styled(PrimaryButton)`
  border-radius: 0;
  border-radius: 100px;
  width: 343px;
  padding: 18px 0;
`;

export const ImportKeyButton = styled(SecondaryButton)<{
  show: boolean;
}>`
  width: 200px;
  max-height: 40px;
  height: 40px;
  position: absolute;
  top: -56px;
  right: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.palette.grey[900]};
  transition: all 0.2s;
  transform-origin: bottom right;
  transform: ${({ show }) =>
    show
      ? 'translateY(0) translateX(0) scale(1)'
      : 'translateY(40px) translateX(-20px) scale(0)'};
  opacity: ${({ show }) => (show ? '1' : '0')};
  :hover {
    background-color: ${({ theme }) => theme.palette.grey[600]};
  }
  padding: 10px 20px;
`;

export const StyledPlusIcon = styled(PlusIcon)`
  margin-right: 14px;
`;

export const StyledTrashIcon = styled(TrashIcon)`
  margin-right: 14px;
`;

export const StyledKeyIcon = styled(KeyIcon)`
  margin-right: 14px;
`;
