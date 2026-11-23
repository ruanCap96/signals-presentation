import { Pipe, PipeTransform } from '@angular/core';

/** Displays any value a live-code signal might hold, e.g. arrays or objects as JSON. */
@Pipe({ name: 'show' })
export class ShowPipe implements PipeTransform {
  transform(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'function') return 'ƒ';
    if (value !== null && typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }
}
