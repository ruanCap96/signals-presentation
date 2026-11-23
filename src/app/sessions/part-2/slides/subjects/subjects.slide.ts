import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { CodeBlock } from '../../../../shared/code-block';

const SUBJECT = `const s = new Subject<number>();
s.next(1);
s.subscribe(v => log(v));
// → nothing yet`;

const BEHAVIOR_SUBJECT = `const b = new BehaviorSubject(0);
b.next(1);
b.subscribe(v => log(v));
// → 1 (current value)`;

@Component({
  selector: 'app-subjects-slide',
  imports: [CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './subjects.slide.html',
})
export class SubjectsSlide {
  readonly subjectCode = SUBJECT;
  readonly behaviorSubjectCode = BEHAVIOR_SUBJECT;

  private readonly subject = new Subject<number>();
  private readonly behaviorSubject = new BehaviorSubject(0);
  readonly emitted = signal(0);
  readonly subscribed = signal(false);
  readonly subjectLog = signal<number[]>([]);
  readonly behaviorLog = signal<number[]>([]);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.subject.complete();
      this.behaviorSubject.complete();
    });
  }

  next(): void {
    this.emitted.update((n) => n + 1);
    this.subject.next(this.emitted());
    this.behaviorSubject.next(this.emitted());
  }

  subscribeLate(): void {
    if (this.subscribed()) return;
    this.subscribed.set(true);
    this.subject.subscribe((v) => this.subjectLog.update((log) => [...log, v]));
    this.behaviorSubject.subscribe((v) => this.behaviorLog.update((log) => [...log, v]));
  }
}
