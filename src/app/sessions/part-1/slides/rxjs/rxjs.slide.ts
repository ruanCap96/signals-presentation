import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';
import { Definition } from '../../../../shared/definition';
import { steps } from '../../../../shared/steps';

interface Approach {
  tag: string;
  tone: string;
  state: string;
  change: string;
  template: string;
}

const RENAME = (body: string) => `rename() {\n  ${body}\n}`;
const BUTTON = (read: string) => `<button (click)="rename()">\n  {{ ${read} }}\n</button>`;

@Component({
  selector: 'app-rxjs-slide',
  imports: [Definition, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './rxjs.slide.html',
})
export class RxjsSlide {
  readonly steps = steps(['signal']);

  readonly approaches: Approach[] = [
    {
      tag: 'Observable',
      tone: 'before',
      state: `name$ = new BehaviorSubject('Ada');`,
      change: RENAME(`this.name$.next('Bo');`),
      template: BUTTON('name$ | async'),
    },
    {
      tag: 'Signal',
      tone: 'now',
      state: `name = signal('Ada');`,
      change: RENAME(`this.name.set('Bo');`),
      template: BUTTON('name()'),
    },
  ];
}
