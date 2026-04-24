import { getAbortReason } from '../internal';
import { anySignal } from '../signal/any-signal';

export function timeout<T>(
  timeout: number,
  callback: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) {
    return Promise.reject(getAbortReason(signal));
  }

  const controller = new AbortController();

  const onAbort = () => {
    cleanup();
    controller.abort(getAbortReason(signal));
  };

  let timer: ReturnType<typeof setTimeout> | undefined;

  const cleanup = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    signal?.removeEventListener('abort', onAbort);
  };

  signal?.addEventListener('abort', onAbort, { once: true });

  timer = setTimeout(() => {
    controller.abort(
      new DOMException(
        `The operation timed out (${timeout}ms)`,
        'TimeoutError',
      ),
    );
  }, timeout);

  const { signal: own } = controller;
  const combined = signal ? anySignal(signal, own) : own;

  return callback(combined).finally(cleanup);
}
