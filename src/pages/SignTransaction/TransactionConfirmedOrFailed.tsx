import React from 'react';
import { VerticalFlex, useThemeContext } from '@avalabs/react-components';
import styled from 'styled-components';
import { Modal } from '@src/components/common/Modal';
import { SuccessFailTxInfo } from './components/SuccessFailTxInfo';

const ContainerWithBg = styled(VerticalFlex)<{
  isDarkTheme: boolean;
  darkThemeImg: string;
  lightThemeImg: string;
}>`
  background: ${({ isDarkTheme, darkThemeImg, lightThemeImg }) =>
    isDarkTheme ? darkThemeImg : lightThemeImg};
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.bg4};
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0 0;
`;

export function TransactionConfirmation({
  txId,
  onClose,
}: {
  txId: string;
  onClose(): void;
}) {
  const { darkMode } = useThemeContext();

  return (
    <Modal isOpen={true}>
      <ContainerWithBg
        darkThemeImg={`url(images/illustrations/successful-transation-dark.png)`}
        lightThemeImg={`url(images/illustrations/successful-transation-light.png)`}
        isDarkTheme={!!darkMode}
      >
        <SuccessFailTxInfo
          onClicked={onClose}
          txId={txId}
          title="Successful Transaction"
          action="Done"
        />
      </ContainerWithBg>
    </Modal>
  );
}

export function TransactionFailure({
  txId,
  onClose,
  message,
}: {
  txId: string;
  onClose(): void;
  message: string;
}) {
  const { darkMode } = useThemeContext();

  return (
    <Modal isOpen={true}>
      <ContainerWithBg
        darkThemeImg={`url(images/illustrations/transaction-failed-dark.png)`}
        lightThemeImg={`url(images/illustrations/transaction-failed-light.png)`}
        isDarkTheme={!!darkMode}
      >
        <SuccessFailTxInfo
          onClicked={onClose}
          txId={txId}
          message={message}
          title="Transaction Failed"
          action="Done"
        />
      </ContainerWithBg>
    </Modal>
  );
}
