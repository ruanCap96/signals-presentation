import { Component, isSignal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { liveCode, readFunction, readSignal, runLiveCode } from './live-code';

const CODE = `const count = signal<number>(2);
const doubled = computed(() => count() * 2);
function increment() { count.update(n => n + 1); }`;

@Component({ template: '' })
class Host {
  readonly live = liveCode(CODE, ['count', 'doubled', 'increment'], (scope) => ({
    count: readSignal(scope, 'count'),
    doubled: readSignal(scope, 'doubled') as Signal<number>,
    increment: readFunction(scope, 'increment'),
  }));
}

describe('runLiveCode', () => {
  it('runs TypeScript and returns the named declarations as real signals', () => {
    const scope = runLiveCode(CODE, ['count', 'doubled', 'increment', 'missing']);
    expect(isSignal(scope['count'])).toBe(true);
    (scope['increment'] as () => void)();
    expect((scope['doubled'] as Signal<number>)()).toBe(6);
    expect(scope['missing']).toBeUndefined();
  });

  it('rejects loops so the slide cannot freeze, but not in comments or strings', () => {
    expect(() => runLiveCode('while (true) {}', [])).toThrow(/loops are disabled/);
    expect(() => runLiveCode('for (;;) {}', [])).toThrow(/loops are disabled/);
    expect(() => runLiveCode("// for later\nconst s = 'while';", [])).not.toThrow();
  });

  it('reports missing or wrongly typed declarations', () => {
    expect(() => readSignal({ count: 1 }, 'count')).toThrow('Define `count` with signal()');
    expect(() => readFunction({}, 'increment')).toThrow('function called `increment`');
  });
});

describe('liveCode', () => {
  let host: Host;

  beforeEach(() => {
    vi.useFakeTimers();
    host = TestBed.createComponent(Host).componentInstance;
  });

  afterEach(() => vi.useRealTimers());

  it('evaluates the initial code immediately', () => {
    expect(host.live.scope().count()).toBe(2);
    expect(host.live.edited()).toBe(false);
  });

  it('applies edits after a short pause and keeps the last working version on errors', () => {
    host.live.edit(CODE.replace('* 2', '* 10'));
    expect(host.live.scope().doubled()).toBe(4);
    vi.advanceTimersByTime(300);
    expect(host.live.scope().doubled()).toBe(20);
    expect(host.live.edited()).toBe(true);

    host.live.edit('const count = ;');
    vi.advanceTimersByTime(300);
    expect(host.live.error()).toContain('Unexpected token');
    expect(host.live.scope().doubled()).toBe(20);

    host.live.reset();
    expect(host.live.error()).toBeNull();
    expect(host.live.scope().doubled()).toBe(4);
    expect(host.live.edited()).toBe(false);
  });

  it('shows errors thrown by user functions instead of crashing', () => {
    host.live.call(() => {
      throw new TypeError('doubled.set is not a function');
    });
    expect(host.live.error()).toBe('doubled.set is not a function');
    host.live.call(host.live.scope().increment);
    expect(host.live.scope().count()).toBe(3);
  });
});
