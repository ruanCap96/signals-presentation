import { computed, DestroyRef, inject, isSignal, Signal, signal, untracked } from '@angular/core';
import { transform } from 'sucrase';

import { highlight } from './code-block';
import { steps as createSteps, Steps } from './steps';

export type Scope = Record<string, unknown>;

/**
 * Runs slide code in the page so the signals it creates can drive the LIVE panel.
 * Loops are rejected because a runaway loop here would freeze the presentation.
 */
export function runLiveCode(source: string, names: readonly string[]): Scope {
  const loop = highlight(source)
    .flat()
    .find((t) => t.kind === 'plain' && (t.text === 'while' || t.text === 'for'));
  if (loop) {
    throw new Error(`\`${loop.text}\` loops are disabled on slides. Try them in /lab.`);
  }
  const { code } = transform(source, { transforms: ['typescript'], filePath: 'live.ts' });
  const exported = names.map((n) => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`);
  const run = new Function(
    'signal',
    'computed',
    `"use strict";\n${code}\nreturn { ${exported.join(', ')} };`,
  );
  return run(signal, computed) as Scope;
}

export function readSignal(scope: Scope, name: string): Signal<unknown> {
  const value = scope[name];
  if (!isSignal(value)) throw new Error(`Define \`${name}\` with signal() or computed().`);
  return value;
}

export function readFunction(scope: Scope, name: string): () => unknown {
  const value = scope[name];
  if (typeof value !== 'function' || isSignal(value)) {
    throw new Error(`Define a function called \`${name}\`.`);
  }
  return value as () => unknown;
}

/** For names that only exist after a later build-up step. */
export function readOptionalSignal(scope: Scope, name: string): Signal<unknown> | undefined {
  return scope[name] === undefined ? undefined : readSignal(scope, name);
}

export function readOptionalFunction(scope: Scope, name: string): (() => unknown) | undefined {
  return scope[name] === undefined ? undefined : readFunction(scope, name);
}

export interface LiveStep {
  label: string;
  code: string;
}

export interface LiveCodeOptions {
  delay?: number;
  /** Code appended to the editor, one block per step. */
  steps?: readonly LiveStep[];
}

export interface LiveCode<T> {
  readonly initial: string;
  readonly source: Signal<string>;
  /** Last version of the code that ran without errors. */
  readonly scope: Signal<T>;
  readonly error: Signal<string | null>;
  readonly edited: Signal<boolean>;
  readonly steps: Steps;
  edit(source: string): void;
  reset(): void;
  call(fn: () => unknown): void;
}

/** Must be called in an injection context (e.g. a component field initializer). */
export function liveCode<T>(
  initial: string,
  names: readonly string[],
  read: (scope: Scope) => T,
  { delay = 300, steps = [] }: LiveCodeOptions = {},
): LiveCode<T> {
  const source = signal(initial);
  /** The code for the steps revealed so far; Reset code returns here. */
  const baseline = signal(initial);
  const error = signal<string | null>(null);
  const evaluate = (code: string) => untracked(() => read(runLiveCode(code, names)));
  const scope = signal(evaluate(initial));
  let timer: ReturnType<typeof setTimeout> | undefined;

  const report = (e: unknown) => error.set(e instanceof Error ? e.message : String(e));
  const apply = () => {
    clearTimeout(timer);
    timer = undefined;
    try {
      scope.set(evaluate(source()));
      error.set(null);
    } catch (e) {
      report(e);
    }
  };
  inject(DestroyRef).onDestroy(() => clearTimeout(timer));

  return {
    initial,
    source: source.asReadonly(),
    scope: scope.asReadonly(),
    error: error.asReadonly(),
    edited: computed(() => source() !== baseline()),
    steps: createSteps(
      steps.map((s) => s.label),
      (step) => {
        const append = (code: string) => `${code.trimEnd()}\n\n${steps[step - 1].code}`;
        baseline.update(append);
        source.update(append);
        apply();
      },
    ),
    edit(code) {
      source.set(code);
      clearTimeout(timer);
      timer = setTimeout(apply, delay);
    },
    reset() {
      source.set(baseline());
      apply();
    },
    call(fn) {
      try {
        untracked(fn);
      } catch (e) {
        report(e);
      }
    },
  };
}
