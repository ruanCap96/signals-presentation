import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';
import { Definition } from '../../../../shared/definition';
import { steps } from '../../../../shared/steps';

const COMPONENT = `count = signal(0);
// template: {{ count() }}`;

const SERVICE = `@Injectable({ providedIn: 'root' })
export class CounterService {
  count = signal(0);
}

// any component
counter = inject(CounterService);
// template: {{ counter.count() }}`;

const EXAMPLE = `hidden = signal(false);

dismiss(): void {
  this.hidden.set(true);
}

// template
@if (!hidden()) { … }`;

@Component({
  selector: 'app-where-slide',
  imports: [Definition, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './where.slide.html',
})
export class WhereSlide {
  readonly component = COMPONENT;
  readonly service = SERVICE;
  readonly example = EXAMPLE;
  readonly hidden = signal(false);
  readonly steps = steps(['service', 'example']);
}
