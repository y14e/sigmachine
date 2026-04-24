export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((r, s) => {
    resolve = r;
    reject = s;
  });
  return { promise, resolve, reject };
}
