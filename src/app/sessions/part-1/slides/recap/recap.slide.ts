import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';
import { steps } from '../../../../shared/steps';

const BEFORE = `name = '';
sub = inject(UserService).name$
  .subscribe((n) => (this.name = n));

ngOnDestroy() {
  this.sub.unsubscribe();
}`;

const AFTER = `name = inject(UserService).name;
// template: {{ name() }}
// nothing to unsubscribe`;

@Component({
  selector: 'app-recap-slide',
  imports: [CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './recap.slide.html',
})
export class RecapSlide {
  readonly before = BEFORE;
  readonly after = AFTER;
  readonly steps = steps(['what?', 'why?', 'how?', 'example']);
}
