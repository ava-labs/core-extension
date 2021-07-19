import { SELECTEDNETWORK } from '@src/store/network/networkStore';
import { useEffect, useState } from 'react';
import { WalletType } from '../../../avalanche-wallet-sdk-internal/dist/Wallet/types';

export function useAddresses(wallet?: WalletType, network?: SELECTEDNETWORK) {
  const [addressX, setAddressX] = useState('');
  const [addressP, setAddressP] = useState('');
  const [addressC, setAddressC] = useState('');

  function updateAddresses() {
    if (!wallet) return;

    let addrX = wallet.getAddressX();
    let addrP = wallet.getAddressP();
    let addrC = wallet.getAddressC();

    setAddressX(addrX);
    setAddressP(addrP);
    setAddressC(addrC);

    // let payload = {
    //   X: addrX,
    //   P: addrP,
    //   C: addrC,
    // };

    // dispatch({
    //   type: NetworkConfigActionType.UPDATE_ADDRESSES,
    //   payload,
    // });
  }

  useEffect(() => {
    if (!wallet) return;

    function onAddressChange(addrs: any) {
      // console.log("On Address Change");
      // console.log(addrs);
      updateAddresses();
    }

    wallet.on('addressChanged', onAddressChange);
    return () => {
      wallet.off('addressChanged', onAddressChange);
    };
  }, [wallet]);

  useEffect(() => {
    updateAddresses();
  }, [network]);

  return {
    addressX,
    addressP,
    addressC,
  };
}
