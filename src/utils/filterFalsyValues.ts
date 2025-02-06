import type { Observable } from 'rxjs';
import { filter } from 'rxjs';

export function filterFalseyValues<T = any>() {
  return (observer: Observable<T>) => observer.pipe(filter((value) => !!value));
}
