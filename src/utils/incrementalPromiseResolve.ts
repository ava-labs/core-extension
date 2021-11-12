function incrementAndCall<T>(prom: Promise<T>, interval = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      prom.then((res) => resolve(res));
    }, 500 * interval);
  });
}
/**
 * If we have api requests or fetches that need to be tried a few times in order to get results
 * we expect than we can do an incremental step off before telling the user it failed
 *
 * @param prom
 * @param errorParser
 * @param increment
 * @param maxTries
 * @returns promise result
 */
export async function incrementalPromiseResolve<T>(
  prom: () => Promise<T>,
  errorParser: (res: any) => boolean,
  increment = 0,
  maxTries = 10
) {
  const res = await incrementAndCall(prom(), 0);
  if (maxTries === increment) return res;
  if (errorParser(res))
    return incrementalPromiseResolve(() => prom(), errorParser, increment + 1);
  return res;
}