import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CodePlayground, PLAYGROUND_WORKER } from './code-playground';

class TestWorker {
  onmessage?: (event: MessageEvent<{ lines: string[]; error: string | null }>) => void;
  onerror?: (event: ErrorEvent) => void;
  readonly terminate = vi.fn();
  readonly postMessage = vi.fn();
}

describe('CodePlayground', () => {
  let fixture: ComponentFixture<CodePlayground>;
  let component: CodePlayground;
  let workers: TestWorker[];
  const example = 'const count = signal(2); log(count());';

  beforeEach(async () => {
    workers = [];
    await TestBed.configureTestingModule({
      imports: [CodePlayground],
      providers: [
        {
          provide: PLAYGROUND_WORKER,
          useValue: () => {
            const worker = new TestWorker();
            workers.push(worker);
            return worker;
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CodePlayground);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('example', example);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('starts with the example, sends edited code to a fresh worker on each run', () => {
    const el: HTMLElement = fixture.nativeElement;
    const editor = el.querySelector('textarea')!;
    expect(editor.value).toBe(example);
    editor.value = 'log(signal(42)());';
    editor.dispatchEvent(new Event('input'));
    el.querySelector<HTMLButtonElement>('[data-testid="run-code"]')!.click();
    expect(workers[0].postMessage).toHaveBeenCalledWith('log(signal(42)());');
    workers[0].onmessage?.(new MessageEvent('message', { data: { lines: ['42'], error: null } }));
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="code-output"]')?.textContent).toBe('42');
    expect(workers[0].terminate).toHaveBeenCalledOnce();
    component.run();
    expect(workers).toHaveLength(2);
  });

  it('displays errors alongside any preceding log output', () => {
    component.run();
    workers[0].onmessage?.(
      new MessageEvent('message', {
        data: { lines: ['Before error'], error: 'count is not defined' },
      }),
    );
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="code-output"]')?.textContent).toBe('Before error');
    expect(el.querySelector('[data-testid="code-error"]')?.textContent).toBe(
      'count is not defined',
    );
    expect(component.running()).toBe(false);
  });

  it('shows worker failures and terminates the worker', () => {
    component.run();
    workers[0].onerror?.(new ErrorEvent('error', { message: 'Worker failed' }));
    expect(component.error()).toBe('Worker failed');
    expect(workers[0].terminate).toHaveBeenCalledOnce();
  });

  it('terminates long-running code after three seconds and can run again', () => {
    vi.useFakeTimers();
    component.run();
    vi.advanceTimersByTime(2999);
    expect(workers[0].terminate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(workers[0].terminate).toHaveBeenCalledOnce();
    expect(component.error()).toContain('3 seconds');
    expect(component.running()).toBe(false);
    component.run();
    expect(component.error()).toBeNull();
    expect(workers).toHaveLength(2);
  });

  it('resets the source and output, cancels execution and clears its timer', () => {
    vi.useFakeTimers();
    component.source.set('while (true) {}');
    component.run();
    component.reset();
    expect(component.source()).toBe(example);
    expect(component.output()).toContain('Click Run');
    expect(workers[0].terminate).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(3000);
    expect(component.error()).toBeNull();
  });

  it('runs with Ctrl/Cmd + Enter', () => {
    const editor = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true }));
    expect(workers).toHaveLength(1);
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(workers).toHaveLength(1);
  });

  it('terminates execution on destruction', () => {
    component.run();
    fixture.destroy();
    expect(workers[0].terminate).toHaveBeenCalledOnce();
  });

  it('reports an unavailable worker instead of leaving Run disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CodePlayground],
      providers: [
        {
          provide: PLAYGROUND_WORKER,
          useValue: () => {
            throw new Error('Workers unavailable');
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CodePlayground);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('example', example);
    component.run();
    expect(component.error()).toBe('Workers unavailable');
    expect(component.running()).toBe(false);
  });
});
