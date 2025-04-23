import Dialog, { DialogProps } from 'packages/ui/src/components/common/Dialog';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface DialogContextProviderProps {
  children?: ReactNode;
}

export const DialogContext = createContext<{
  showDialog(props: DialogProps): void;
  clearDialog(): void;
}>({} as any);

export const DialogContextProvider = ({
  children,
}: DialogContextProviderProps) => {
  const [dialogProps, setDialogProps] = useState<DialogProps | null>();

  const showDialog = useCallback((props: DialogProps) => {
    setDialogProps(props);
  }, []);

  const clearDialog = useCallback(() => {
    setDialogProps(null);
  }, []);

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        clearDialog,
      }}
    >
      {children}
      {dialogProps && <Dialog {...dialogProps} open={!!dialogProps} />}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  return useContext(DialogContext);
}
