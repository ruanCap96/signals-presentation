import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { highlight } from './code-block';
import { LiveCode } from './live-code';

@Component({
  selector: 'app-live-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './live-editor.html',
})
export class LiveEditor {
  readonly live = input.required<LiveCode<unknown>>();
  readonly note = input<string>();
  protected readonly lines = computed(() => highlight(this.live().source()));

  protected edit(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) this.live().edit(event.target.value);
  }
}
