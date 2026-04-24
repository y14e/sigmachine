import type { Task } from '../types';
import { all } from './all';

export function map<T, R>(
  items: T[],
  concurrent: number,
  callback: (item: T, signal: AbortSignal, i: number) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  const tasks: Task<R>[] = items.map((item, i) => {
    return (s) => {
      return callback(item, s, i);
    };
  });
  return all(tasks, concurrent, signal);
}
