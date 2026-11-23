import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';

const CODE = `// ① form status (Observable) → signal
formInvalid = toSignal(
  this.form.statusChanges.pipe(
    startWith(this.form.status),
    map(() => this.form.invalid),
  ),
  { initialValue: this.form.invalid },
);

// ② NgRx selector (Observable) → signal
isLoading = toSignal(
  this.store.select(selectIsSaving),
  { initialValue: false },
);

// ③ combine both
isDisabledSubmitButton = computed(
  () => this.formInvalid() || this.isLoading(),
);`;

@Component({
  selector: 'app-dialog-slide',
  imports: [CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './dialog.slide.html',
})
export class DialogSlide {
  readonly code = CODE;
}
