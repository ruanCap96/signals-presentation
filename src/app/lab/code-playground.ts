import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

export const PLAYGROUND_WORKER = new InjectionToken<() => Worker>('Playground worker', {
  providedIn: 'root',
  factory: () => () =>
    new Worker(new URL('./playground.worker', import.meta.url), { type: 'module' }),
});

const IDLE_OUTPUT = 'Use log(value) to show results. Click Run to execute.';

@Component({
  selector: 'app-code-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-playground.html',
})
export class CodePlayground implements OnInit, OnDestroy {
  readonly example = input.required<string>();
  readonly source = signal('');
  readonly output = signal(IDLE_OUTPUT);
  readonly error = signal<string | null>(null);
  readonly running = signal(false);
  private readonly createWorker = inject(PLAYGROUND_WORKER);
  private worker?: Worker;
  private timeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.source.set(this.example());
  }

  edit(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) this.source.set(event.target.value);
  }

  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.run();
    }
  }

  run(): void {
    this.stop();
    this.output.set('');
    this.error.set(null);
    this.running.set(true);
    try {
      const worker = this.createWorker();
      this.worker = worker;
      worker.onmessage = ({ data }: MessageEvent<{ lines: string[]; error: string | null }>) => {
        this.output.set(data.lines.join('\n') || (data.error ? '' : 'Finished. No log output.'));
        this.error.set(data.error);
        this.stop();
      };
      worker.onerror = (event) => {
        event.preventDefault();
        this.error.set(event.message || 'The playground worker could not run.');
        this.stop();
      };
      this.timeout = setTimeout(() => {
        this.error.set('Execution stopped after 3 seconds. Check for an infinite loop.');
        this.stop();
      }, 3000);
      worker.postMessage(this.source());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : String(error));
      this.stop();
    }
  }

  reset(): void {
    this.stop();
    this.source.set(this.example());
    this.output.set(IDLE_OUTPUT);
    this.error.set(null);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    this.worker?.terminate();
    this.worker = undefined;
    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.running.set(false);
  }
}
