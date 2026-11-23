import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { sessionLinks } from '../shell/session';
import { CodePlayground } from './code-playground';
import { labExamples } from './lab-examples';

@Component({
  selector: 'app-lab',
  imports: [CodePlayground, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  templateUrl: './lab.html',
})
export class Lab {
  readonly links = sessionLinks;
  readonly examples = labExamples;
  private readonly exampleId = signal(labExamples[0].id);
  readonly example = computed(
    () => this.examples.find((ex) => ex.id === this.exampleId()) ?? this.examples[0],
  );

  choose(event: Event): void {
    if (event.target instanceof HTMLSelectElement) this.exampleId.set(event.target.value);
  }
}
