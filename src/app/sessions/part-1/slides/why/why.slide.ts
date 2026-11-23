import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';

import { Definition } from '../../../../shared/definition';
import { steps } from '../../../../shared/steps';

interface Box<T = unknown> {
  name: string;
  value: WritableSignal<T>;
  next: (value: T) => T;
}

interface Reader {
  label: string;
  template: string;
  view: Signal<string>;
  runs: number;
}

interface Change {
  box: string;
  readers: string[];
  tick: number;
}

const box = <T>(name: string, initial: T, next: (value: T) => T): Box =>
  ({ name, value: signal(initial), next }) as Box;

@Component({
  selector: 'app-why-slide',
  imports: [Definition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './why.slide.html',
})
export class WhySlide {
  readonly steps = steps(['readers']);

  readonly boxes: Box[] = [
    box('name', 'Ada', (v) => (v === 'Ada' ? 'Bo' : 'Ada')),
    box('age', 30, (v) => v + 1),
    box('loggedIn', true, (v) => !v),
    box('theme', 'dark', (v) => (v === 'dark' ? 'light' : 'dark')),
    box('cartCount', 0, (v) => v + 1),
    box('language', 'en', (v) => (v === 'en' ? 'nl' : 'en')),
  ];

  private readonly value = (name: string) => this.boxes.find((b) => b.name === name)!.value;

  // computed() stands in for a piece of template: it only re-runs when a signal it read changes.
  readonly readers: Reader[] = [
    this.reader('Greeting', '<h1>Hi, {{ name() }}</h1>', () => `Hi, ${this.value('name')()}`),
    this.reader('Theme', '<body [class]="theme()">', () => `${this.value('theme')()} mode`),
  ];

  readonly last = signal<Change | null>(null);

  change(b: Box): void {
    b.value.update(b.next);
    const readers = untracked(() =>
      this.readers
        .filter((r) => {
          const before = r.runs;
          r.view();
          return r.runs > before;
        })
        .map((r) => r.label),
    );
    this.last.update((c) => ({ box: b.name, readers, tick: (c?.tick ?? 0) + 1 }));
  }

  private reader(label: string, template: string, render: () => string): Reader {
    const r: Reader = {
      label,
      template,
      runs: 0,
      view: computed(() => {
        r.runs++;
        return render();
      }),
    };
    return r;
  }
}
