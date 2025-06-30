import { createContext, FC, ReactNode, use, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

type UnregisterFn = () => void;
type NavigateBackContext = {
  register: (callback: VoidFunction) => UnregisterFn;
  goBack: VoidFunction;
};

type Props = {
  children: (goBack: VoidFunction) => ReactNode;
};

const NavigateBackContext = createContext<NavigateBackContext | undefined>(
  undefined,
);

export const NavigateBackProvider: FC<Props> = ({ children }) => {
  const { goBack } = useHistory();

  const context = useMemo<NavigateBackContext>(() => {
    let onGoBack: VoidFunction | undefined;
    return {
      register: (goBackFn: VoidFunction) => {
        onGoBack = goBackFn;
        return () => {
          onGoBack = undefined;
        };
      },
      goBack: () => (onGoBack ?? goBack)(),
    };
  }, [goBack]);

  return (
    <NavigateBackContext.Provider value={context}>
      {children(context.goBack)}
    </NavigateBackContext.Provider>
  );
};

export const useNavigateBack = () => {
  const context = use(NavigateBackContext);
  if (!context) {
    throw new Error(
      'useNavigateBack must be used within a NavigateBackProvider',
    );
  }
  return context;
};
