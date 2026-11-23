import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { CodeBlock } from '../../../../shared/code-block';
import { Definition } from '../../../../shared/definition';
import { steps } from '../../../../shared/steps';

const SETUP = `user = signal({ name: 'Sam', age: 30 });
age = computed(() => this.user().age);`;

const MUTATE = `user().age += 1;
// will age() change?`;

const REPLACE = `user.update(currentUser => ({
  ...currentUser,
  age: currentUser.age + 1
}));`;

@Component({
  selector: 'app-gotcha-slide',
  imports: [Definition, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './gotcha.slide.html',
})
export class GotchaSlide {
  readonly steps = steps(['question', 'replace', 'remember']);
  readonly setup = SETUP;
  readonly mutate = MUTATE;
  readonly replace = REPLACE;

  readonly user = signal({ name: 'Sam', age: 30 });
  readonly age = computed(() => this.user().age);

  mutateUser(): void {
    this.user().age += 1;
  }

  replaceUser(): void {
    this.user.update((currentUser) => ({
      ...currentUser,
      age: currentUser.age + 1,
    }));
  }
}
