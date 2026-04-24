import { run } from '../internal';

export async function parallel<T>(
  tasks: ((signal: AbortSignal) => Promise<T>)[],
  concurrent = Infinity,
  signal?: AbortSignal,
): Promise<T[]> {
  const results: T[] = [];
  await run(tasks, concurrent, signal, (_, result) => {
    if (result.status === 'fulfilled') {
      results[results.length] = result.value;
    }
  });
  return results;
}
