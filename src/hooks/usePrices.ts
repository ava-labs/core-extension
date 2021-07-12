import { useEffect, useState } from 'react';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

export function usePrices() {
  let [avaxUSD, setAvaxUSD] = useState(0);

  function updatePrice() {
    Utils.getAvaxPrice().then((res) => {
      res !== avaxUSD && setAvaxUSD(res);
    });
  }

  useEffect(() => {
    updatePrice();
    let interval = setInterval(() => {
      updatePrice();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { avaxUSD };
}
