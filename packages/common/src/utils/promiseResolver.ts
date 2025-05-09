export function resolve<T = any>(promise: Promise<T>) {
  try {
    return promise.then((res) => [res, null]).catch((err) => [null, err]);
  } catch (err) {
    return Promise.resolve([null, err]);
  }
}
