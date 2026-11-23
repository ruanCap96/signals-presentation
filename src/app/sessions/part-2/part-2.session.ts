import { Session } from '../../shell/session';
import { DerivedVsSlide } from './slides/derived-vs/derived-vs.slide';
import { DialogSlide } from './slides/dialog/dialog.slide';
import { Part2IntroSlide } from './slides/intro/intro.slide';
import { SubjectsSlide } from './slides/subjects/subjects.slide';
import { ToolsSlide } from './slides/tools/tools.slide';

/** Draft: slides moved out of Part 1 to keep the first session introductory. */
export const part2: Session = {
  id: 'part-2',
  title: 'Angular Signals · Part 2 (draft)',
  slides: [
    {
      id: 'intro',
      title: 'Angular Signals · Part 2',
      hero: true,
      minutes: 2,
      component: Part2IntroSlide,
      notes: `Draft session. Recap Part 1 in one sentence: signal holds a value, computed derives, templates read them.
Today: how signals and RxJS work together.`,
    },
    {
      id: 'subjects',
      title: 'Before signals: Subject & BehaviorSubject',
      lead: 'Same steps — next a value, then subscribe late.',
      minutes: 3,
      interactive: true,
      component: SubjectsSlide,
      notes: `A BehaviorSubject starts at 0. Click ① next(1) first, then ② subscribe().
Subject: late subscriber gets nothing until the next emission.
BehaviorSubject: late subscriber gets the current value — that is why we used it for state.
A signal always has a current value, like a BehaviorSubject, but without subscribing.`,
    },
    {
      id: 'derived-vs',
      title: 'Derived state: combineLatest vs computed',
      lead: 'Disable Save while the form is invalid or saving.',
      minutes: 3,
      interactive: true,
      component: DerivedVsSlide,
      notes: `Toggle the checkboxes — both buttons always agree.
combineLatest waits until every source has emitted — fine with BehaviorSubjects, a trap with HTTP or plain Subjects.
The async pipe's type includes null (no value yet), hence the ?? true fallback in the real template.
computed is synchronous: it always has a value, no fallback needed.
Next: this same pattern in a real form dialog with toSignal.`,
    },
    {
      id: 'dialog',
      title: 'In practice: forms, NgRx and signals together',
      lead: 'edit-item-dialog.component.ts',
      minutes: 3,
      component: DialogSlide,
      notes: `① form.statusChanges is an Observable → toSignal turns it into a signal.
② toSignal for the NgRx loading flag (store.selectSignal is a shorter alternative).
③ computed combines both — same idea as the previous slide.
toSignal subscribes once, cleans up when the component is destroyed. initialValue is the value before the first emission, not an error fallback.`,
    },
    {
      id: 'tools',
      title: 'Which tool when?',
      minutes: 2,
      component: ToolsSlide,
      notes: `Not "signals replace RxJS". They complement each other.
Signals: values on screen. RxJS: events and async over time (HTTP, debounce, websockets).
NgRx: shared app state — and the store can hand you signals.`,
    },
  ],
};
