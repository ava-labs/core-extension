import { filter, Observable } from 'rxjs';

export function filterFalseyValues<T = any>() {
  return (observer: Observable<T>) => observer.pipe(filter((value) => !!value));
}
