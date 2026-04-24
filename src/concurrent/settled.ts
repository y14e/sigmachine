import { run } from '../internal';

export const settled = async <T>(
  tasks: ((signal: AbortSignal) => Promise<T>)[],
  concurrent = Infinity,
  signal?: AbortSignal,
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  await run(tasks, concurrent, signal, (i, result) => {
    results[i] = result;
  });
  return results;
};
