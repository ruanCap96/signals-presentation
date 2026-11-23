import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'definition', role: 'note' },
  templateUrl: './definition.html',
})
export class Definition {
  readonly label = input<string>();
  readonly source = input('essentials/signals');
  readonly tone = input<'now' | 'before'>('now');
  readonly href = computed(() => `https://angular.dev/${this.source()}`);
}
