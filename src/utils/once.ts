export function once<T extends unknown[], R>(
  callback: (...args: T) => Promise<R>,
): (...args: T) => Promise<R> {
  let promise: Promise<R> | undefined;
  return (...args: T) => {
    if (!promise) {
      promise = callback(...args);
    }

    return promise;
  };
}
