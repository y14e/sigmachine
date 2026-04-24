import { getAbortReason } from '../internal';

export function sleep(timeout: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(getAbortReason(signal));
      return;
    }

    const onAbort = () => {
      cleanup();
      reject(getAbortReason(signal));
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
      cleanup();
      resolve();
    }, timeout);
  });
}

export const wait = sleep;
