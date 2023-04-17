import { avaxSerial, pvmSerial, utils } from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';

export const isSubnetTx = (tx: avaxSerial.AvaxTx) => {
  return pvmSerial.isCreateChainTx(tx) || pvmSerial.isAddSubnetValidatorTx(tx);
};

export const handleSubnetAuth = async ({
  tx,
  provider,
  addressMaps,
}: {
  tx: pvmSerial.AbstractSubnetTx;
  provider: Avalanche.JsonRpcProvider;
  addressMaps: utils.AddressMaps;
}) => {
  const subnetCreatorTx = await provider
    .getApiP()
    .getTx({ txID: tx.getSubnetID().value() });

  const subnetOwners = (
    subnetCreatorTx.unsignedTx as pvmSerial.CreateSubnetTx
  ).getSubnetOwners();

  const addressMapData = subnetOwners.addrs.map(
    (address, index) => [address, index] as [typeof address, number]
  );

  // add the owner addresses to the existing maps
  addressMaps.push(new utils.AddressMap(addressMapData));

  return addressMaps;
};
