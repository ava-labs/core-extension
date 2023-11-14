function incrementAndCall<T>(
  prom: () => Promise<T>,
  interval = 0
): Promise<T | never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      prom()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
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
  try {
    const res = await incrementAndCall<T>(prom, increment);
    if (maxTries === increment + 1) return res;
    if (errorParser(res)) {
      return incrementalPromiseResolve(
        prom,
        errorParser,
        increment + 1,
        maxTries
      );
    }
    return res;
  } catch (err) {
    if (maxTries === increment + 1)
      throw typeof err === 'string' ? new Error(err) : err;
    if (errorParser(err)) {
      return incrementalPromiseResolve(
        prom,
        errorParser,
        increment + 1,
        maxTries
      );
    }
    throw typeof err === 'string' ? new Error(err) : err;
  }
}
