import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Definition } from '../../../../shared/definition';
import { liveCode, LiveStep, readOptionalFunction, readSignal } from '../../../../shared/live-code';
import { LiveEditor } from '../../../../shared/live-editor';
import { ShowPipe } from '../../../../shared/show.pipe';

// Adapted from angular.dev/essentials/signals
export const WHAT_CODE = `// Create a signal with the signal function.
const firstName = signal('Morgan');`;

export const WHAT_STEPS: LiveStep[] = [
  {
    label: 'rename()',
    code: `// Change it with set…
function rename() {
  const isMorgan = firstName().toLowerCase() === 'morgan';
  firstName.set(isMorgan ? 'Jaime' : 'Morgan');
}`,
  },
  {
    label: 'shout()',
    code: `// …or update it based on the previous value.
function shout() {
  firstName.update((name) => name.toUpperCase());
}`,
  },
];

@Component({
  selector: 'app-what-slide',
  imports: [Definition, LiveEditor, ShowPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './what.slide.html',
})
export class WhatSlide {
  readonly live = liveCode(
    WHAT_CODE,
    ['firstName', 'rename', 'shout'],
    (scope) => ({
      firstName: readSignal(scope, 'firstName'),
      rename: readOptionalFunction(scope, 'rename'),
      shout: readOptionalFunction(scope, 'shout'),
    }),
    { steps: WHAT_STEPS },
  );
}
