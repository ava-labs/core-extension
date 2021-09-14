import React from 'react';
import ReactModal from 'react-modal';
import { useTheme } from 'styled-components';

ReactModal.setAppElement(document.getElementById('popup'));
/**
 * @link http://reactcommunity.org/react-modal/
 */
export function Modal({
  children,
  isOpen,
}: {
  children: any;
  isOpen: boolean;
}) {
  const theme = useTheme();

  return (
    <ReactModal
      isOpen={isOpen}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `#0000009e`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        content: {
          position: 'absolute',
          border: 'none',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          background: theme.colors.grey[900],
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px',
          width: 450,
          height: 650,
        },
      }}
    >
      {children}
    </ReactModal>
  );
}
