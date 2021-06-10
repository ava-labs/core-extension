export function resolve<T = any>(promise: Promise<T>) {
  return promise.then((res) => [res, null]).catch((err) => [null, err]);
}
