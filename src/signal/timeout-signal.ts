import { abortReason } from '@/internal';

export function timeoutSignal(
  timeout: number,
  signal?: AbortSignal,
): AbortSignal {
  const controller = new AbortController();
  const { signal: internal } = controller;

  if (signal?.aborted) {
    controller.abort(abortReason(signal));
    return internal;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;

  const cleanup = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    signal?.removeEventListener('abort', onAbort);
  };

  const onAbort = () => {
    cleanup();
    controller.abort(abortReason(signal));
  };

  signal?.addEventListener('abort', onAbort, { once: true });
  internal.addEventListener('abort', cleanup, { once: true });

  timer = setTimeout(() => {
    controller.abort(
      new DOMException(
        `The operation timed out (${timeout}ms)`,
        'TimeoutError',
      ),
    );
  }, timeout);

  return internal;
}
