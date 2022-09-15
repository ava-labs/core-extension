export function getNetworkIdsToUpdate(
  networkIds: number[],
  iteration: number,
  updatePeriod: number
) {
  const numberOfNetworksToUpdate = Math.ceil(networkIds.length / updatePeriod);

  const roundsWithUpdates = Math.ceil(
    networkIds.length / numberOfNetworksToUpdate
  );

  if (iteration % updatePeriod < roundsWithUpdates) {
    const startIndex =
      ((iteration % updatePeriod) * numberOfNetworksToUpdate) %
      networkIds.length;

    return networkIds.slice(startIndex, startIndex + numberOfNetworksToUpdate);
  }

  return [];
}
