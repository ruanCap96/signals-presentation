import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';

/** Build-up steps for a slide; the session shell advances them before moving to the next slide. */
export interface Steps {
  /** Index of the last revealed step, starting at 0. */
  readonly current: Signal<number>;
  readonly total: number;
  /** Label of the next step, or null when everything is revealed. */
  readonly nextLabel: Signal<string | null>;
  next(): boolean;
}

/** Provided by the session shell so it can drive the current slide's steps. */
@Injectable()
export class StepsHost {
  readonly active = signal<Steps | null>(null);
}

/**
 * `labels[i]` describes step i + 1; step 0 is what the slide starts with.
 * Must be called in an injection context (e.g. a component field initializer).
 */
export function steps(labels: readonly string[], onNext?: (step: number) => void): Steps {
  const current = signal(0);
  const result: Steps = {
    current: current.asReadonly(),
    total: labels.length + 1,
    nextLabel: computed(() => labels[current()] ?? null),
    next() {
      if (current() >= labels.length) return false;
      current.update((s) => s + 1);
      onNext?.(current());
      return true;
    },
  };
  const host = inject(StepsHost, { optional: true });
  if (host && labels.length) {
    host.active.set(result);
    inject(DestroyRef).onDestroy(() => {
      if (host.active() === result) host.active.set(null);
    });
  }
  return result;
}
