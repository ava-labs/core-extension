import { Redirect } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';

import { useModalPageControl } from '@/components/FullscreenModal';

import { NewMfaMethod } from '../types';
import { SeedlessChooseSetupMethod } from '../screens';
import { SeedlessTotpSetupFlow } from './SeedlessTotpSetupFlow';
import { SeedlessFidoSetupFlow } from './SeedlessFidoSetupFlow';

type SeedlessMfaSetupFlowProps = {
  nextScreenPath: string;
};
export const SeedlessMfaSetupFlow: FC<SeedlessMfaSetupFlowProps> = ({
  nextScreenPath,
}) => {
  const { setTotal } = useModalPageControl();
  const [method, setMethod] = useState<NewMfaMethod>();

  useEffect(() => {
    setTotal(0);
  }, [setTotal]);

  return (
    <>
      {!method && <SeedlessChooseSetupMethod onMethodChosen={setMethod} />}
      {method === 'totp' && (
        <SeedlessTotpSetupFlow nextScreenPath={nextScreenPath} />
      )}
      {(method === 'yubikey' || method === 'passkey') && (
        <SeedlessFidoSetupFlow
          nextScreenPath={nextScreenPath}
          keyType={method}
        />
      )}
      {method === 'none' && <Redirect to={nextScreenPath} />}
    </>
  );
};
