import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Definition } from '../../../../shared/definition';
import {
  liveCode,
  LiveStep,
  readOptionalFunction,
  readOptionalSignal,
  readSignal,
} from '../../../../shared/live-code';
import { LiveEditor } from '../../../../shared/live-editor';
import { ShowPipe } from '../../../../shared/show.pipe';

export const COMPUTED_CODE = `const firstName = signal('Maya');
const lastName = signal('Jensen');`;

export const COMPUTED_STEPS: LiveStep[] = [
  {
    label: 'fullName',
    code: `const fullName = computed(() =>
  \`\${firstName()} \${lastName()}\`
);`,
  },
  {
    label: 'rename()',
    code: `function rename() {
  firstName.set('Theo');
}`,
  },
];

@Component({
  selector: 'app-computed-slide',
  imports: [Definition, LiveEditor, ShowPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './computed.slide.html',
})
export class ComputedSlide {
  readonly live = liveCode(
    COMPUTED_CODE,
    ['firstName', 'lastName', 'fullName', 'rename'],
    (scope) => ({
      firstName: readSignal(scope, 'firstName'),
      lastName: readSignal(scope, 'lastName'),
      fullName: readOptionalSignal(scope, 'fullName'),
      rename: readOptionalFunction(scope, 'rename'),
    }),
    { steps: COMPUTED_STEPS },
  );
}
