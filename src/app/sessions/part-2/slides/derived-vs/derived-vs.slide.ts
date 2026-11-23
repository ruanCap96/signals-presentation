import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { CodeBlock } from '../../../../shared/code-block';

const RX_CODE = `disabled$ = combineLatest([
  this.invalid$,
  this.saving$,
]).pipe(
  map(([invalid, saving]) => invalid || saving),
);

[disabled]="disabled$ | async"`;

const SIGNAL_CODE = `disabled = computed(
  () => this.invalid() || this.saving(),
);

[disabled]="disabled()"`;

@Component({
  selector: 'app-derived-vs-slide',
  imports: [AsyncPipe, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './derived-vs.slide.html',
})
export class DerivedVsSlide {
  readonly rxCode = RX_CODE;
  readonly signalCode = SIGNAL_CODE;

  private readonly invalid$ = new BehaviorSubject(true);
  private readonly saving$ = new BehaviorSubject(false);
  readonly disabled$ = combineLatest([this.invalid$, this.saving$]).pipe(
    map(([invalid, saving]) => invalid || saving),
  );

  readonly invalid = signal(true);
  readonly saving = signal(false);
  readonly disabled = computed(() => this.invalid() || this.saving());

  setFlag(flag: 'invalid' | 'saving', event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    const checked = event.target.checked;
    if (flag === 'invalid') {
      this.invalid$.next(checked);
      this.invalid.set(checked);
    } else {
      this.saving$.next(checked);
      this.saving.set(checked);
    }
  }
}
