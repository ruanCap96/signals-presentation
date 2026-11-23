import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';
import { Definition } from '../../../../shared/definition';
import { steps } from '../../../../shared/steps';

interface Side {
  tag: string;
  tone: 'before' | 'now';
  component: string;
  template: string;
  flow: string[];
}

@Component({
  selector: 'app-before-after-slide',
  imports: [Definition, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './before-after.slide.html',
})
export class BeforeAfterSlide {
  readonly steps = steps(['after']);

  readonly sides: Side[] = [
    {
      tag: 'Before · plain field',
      tone: 'before',
      component: `age = 30;\n\nbirthday() {\n  this.age = 31;\n}`,
      template: `<p>{{ age }}</p>`,
      flow: ['Something happened', 'Maybe something changed?', 'Check broadly'],
    },
    {
      tag: 'After · signal',
      tone: 'now',
      component: `age = signal(30);\n\nbirthday() {\n  this.age.set(31);\n}`,
      template: `<p>{{ age() }}</p>`,
      flow: ['age changed', 'Angular is notified', 'This view reads age', 'Update that view'],
    },
  ];
}
