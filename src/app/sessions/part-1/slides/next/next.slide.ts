import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';

interface Teaser {
  api: string;
  category: string;
  hook: string;
  code: string;
}

const TEASERS: Teaser[] = [
  {
    api: 'effect',
    category: 'SIDE EFFECTS',
    hook: 'Make something happen beyond the template.',
    code: `effect(() => save(theme()));`,
  },
  {
    api: 'linkedSignal',
    category: 'WRITABLE DERIVATION',
    hook: 'Derived state with a choice of its own.',
    code: `selected = linkedSignal(() => options()[0]);`,
  },
  {
    api: 'httpResource',
    category: 'ASYNC DATA',
    hook: 'Follow a request through loading, data, and error.',
    code: 'user = httpResource(() => `/users/${id()}`);',
  },
  {
    api: 'toSignal',
    category: 'RXJS INTEROP',
    hook: 'Bring an Observable into signal-based state.',
    code: `status = toSignal(form.statusChanges);`,
  },
];

@Component({
  selector: 'app-next-slide',
  imports: [CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body next-slide' },
  templateUrl: './next.slide.html',
})
export class NextSlide {
  readonly teasers = TEASERS;
}
