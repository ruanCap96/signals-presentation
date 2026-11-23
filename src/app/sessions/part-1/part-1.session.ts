import { Session } from '../../shell/session';
import { BeforeAfterSlide } from './slides/before-after/before-after.slide';
import { ComputedSlide } from './slides/computed/computed.slide';
import { GotchaSlide } from './slides/gotcha/gotcha.slide';
import { NextSlide } from './slides/next/next.slide';
import { IntroSlide } from './slides/intro/intro.slide';
import { RecapSlide } from './slides/recap/recap.slide';
import { RxjsSlide } from './slides/rxjs/rxjs.slide';
import { WhatSlide } from './slides/what/what.slide';
import { WhereSlide } from './slides/where/where.slide';
import { WhySlide } from './slides/why/why.slide';

export const part1: Session = {
  id: 'part-1',
  title: 'Angular Signals · Part 1',
  slides: [
    {
      id: 'intro',
      title: 'Angular Signals',
      hero: true,
      minutes: 1,
      component: IntroSlide,
      notes: `Goal: by the end everyone can read signal() and computed(), knows why they exist and where they'll meet them.
Start from angular.dev/essentials/signals: values, read/set/update, computed, component state.
Ask: who has used signals before? The RxJS comparison is extra context, not a prerequisite.
Agenda: What is it? Why bother? How do I use it? Who uses it, and where?
~23 min of content (the RxJS slide is skippable), leaving time for questions.`,
    },
    {
      id: 'what',
      title: 'What is a signal?',
      minutes: 2,
      interactive: true,
      component: WhatSlide,
      notes: `Build-up (→ or the Next step button): starts with only the signal → adds rename() → adds shout(). Adding a step re-runs the code, so the value starts from Morgan again.
Adapted from angular.dev/essentials/signals: a signal lets you create and manage dynamic data.
firstName is a signal holding 'Morgan'. The LIVE panel reads it by calling it: firstName().
Click rename(): it reads firstName() to decide, then set() replaces the value — Morgan ↔ Jaime toggles. Click shout(): update() works out the new value from the old one (JAIME). rename() still works after shout() thanks to toLowerCase().
Try it: edit 'Morgan' in the code (e.g. to your team's mascot) and the LIVE value follows as you type — the code re-runs, so it starts from the new value.
Edits inside rename() or shout() only run when you click that button (e.g. change 'Jaime' to 'Alex', then click rename()).
Common mistake: {{ firstName }} without () shows the signal function, not the value.
"Aren't we told not to call functions in templates?" That's about methods that do work on every check. A signal read is a cheap getter, and the call is how Angular tracks who reads it.
Reset demo goes back to Morgan. Next: how we did this before signals.`,
    },
    {
      id: 'before-after',
      title: 'Before & after',
      minutes: 2,
      component: BeforeAfterSlide,
      notes: `Build-up: show Before first ("this is how it was"), ask what Angular knows → reveal After.
Same component, two ways.
Before: a plain field. this.age = 31 is just JavaScript; Angular isn't told anything. After an event it runs change detection and compares bindings to find out what changed.
After: a signal. age.set(31) tells Angular exactly which value changed, and it already knows which templates read age.
Read the flow under each side — signals and change detection work together:
Before (eager): something happened → maybe something changed? → check broadly. Angular can't know what a plain field assignment touched.
After (intentional): age changed → Angular is notified → this view reads age → update that view. Change detection still runs; the signal tells it where to look.
If asked: this is why modern Angular is moving to signals + OnPush + zoneless. Zone.js only knows "an event happened"; a signal knows "this value changed and these views read it".
Only two code differences: signal(30) and .set(31), and age() in the template.
Plain fields still work — this is about Angular knowing, not about old code breaking.
Next: why being told matters — the magic boxes.`,
    },
    {
      id: 'why',
      title: 'Why signals?',
      minutes: 3,
      interactive: true,
      component: WhySlide,
      notes: `Build-up: start with the boxes only ("imagine 100 magic boxes") → reveal the readers.
Imagine Angular has 100 magic boxes: name, age, loggedIn, theme… each one a signal.
One piece of UI only cares about name: {{ name() }}. Because it calls name(), Angular can note "this reader cares about the name box".
Click age: the box changes, but nothing on screen reads age, so nothing else re-runs.
Click name: only the Greeting updates. Click theme: only the Theme reader.
The mental model shifts from "EVERYTHING! SOMETHING CHANGED!" to "age changed — who actually cares about age?" That's fine-grained reactivity.
Honest detail if asked: the readers here are computed() stand-ins for template pieces. In an app, Angular marks the components that read the signal for refresh; don't claim it patches single template lines.
Next, for RxJS users: how this compares to a BehaviorSubject.`,
    },
    {
      id: 'rxjs',
      title: 'Coming from RxJS?',
      minutes: 2,
      component: RxjsSlide,
      notes: `Build-up: Observable first → reveal the signal version.
Optional if the room hasn't used RxJS — skip or keep to 30 seconds.
Read it row by row: state, on click (rename() runs when the button is clicked), template.
Observable: a BehaviorSubject holds the value, next() pushes, the async pipe subscribes and tells Angular. It works — but it's plumbing. RxJS isn't "old": it stays the tool for events over time.
Signal: one field, set(), read it by calling it. No subscribe, no async pipe, always has a value.
The takeaway is direct access to a current value, not that Observables are obsolete.
Next: who uses signals, and where — components, services and a real example.`,
    },
    {
      id: 'where',
      title: 'Who uses signals, and where?',
      minutes: 3,
      interactive: true,
      component: WhereSlide,
      notes: `Build-up: component → service → real example.
Who: anyone writing component or UI state. Signals are stable and recommended for synchronous reactive state.
Component: local UI state — open/closed, selected tab, a counter.
Service: the signal lives in a service; any component gets it with inject(CounterService) and reads counter.count() in its template.
providedIn: 'root' means one instance for the whole app, so every component that injects it reads and writes the same signal. When one calls counter.count.set(5), every template reading counter.count() updates.
That's the link: inject() hands the component the same service object, and calling count() in the template makes it a reader, exactly like a local signal.
Real example: a notification component — smallest real example. Click ✕.
If asked about protecting shared state: keep the writable signal private and expose asReadonly(). That removes set/update, but doesn't deep-freeze objects. Leave the extra API out of the main walkthrough.
Next: computed — values built from other signals.`,
    },
    {
      id: 'computed',
      title: 'computed — a value derived from signals',
      minutes: 4,
      interactive: true,
      component: ComputedSlide,
      notes: `Build-up: starts with firstName and lastName → adds fullName (ask: what will it show?) → adds rename().
Same tracking idea as the Why slide, now inside computed.
When Angular runs the computed callback, firstName() and lastName() aren't just reading values. They say "fullName depends on these signals". No dependency list to write.
Click rename(): firstName changes, so fullName recalculates.
Predict, then edit: change firstName.set('Theo') to lastName.set('Okafor'). What will fullName show?
It's read-only: there is no fullName.set(). Change firstName or lastName instead.
If asked: it's lazy and cached, so it only recalculates when a dependency changed and someone reads it.
Next: test what you've learned — a quick quiz with computed().`,
    },
    {
      id: 'gotcha',
      title: 'Test your knowledge',
      minutes: 3,
      interactive: true,
      component: GotchaSlide,
      notes: `Build-up: Hint + setup first → the question (Mutate) → Replace → Remember.
The Hint is on screen from the start: "A signal only notices a NEW value." Ask the room what that means when the value is an object; let them reason toward creating a new object rather than changing a property.
1. Setup: Sam, age 30. The big number is a computed() that reads user().age.
2. Ask the room: "If I do user().age += 1, will the number change?" Let them guess, then click Mutate age. It stays 30.
3. Why: signals use Object.is by default to compare old and new values. We never called set or update, and even if we did, it would be the same object. Same object → "nothing changed" → nobody is told.
   Analogy: you edited a page inside the box. The signal only checks whether someone handed it a different box.
4. Reveal Replace, click Update user. Without a reset it jumps 30 → 32 — use that: "where did 31 go? The mutation DID change the object, the signal just wasn't told. update() finally announced it." (Reset demo first only if you want a clean 30 → 31.)
   Then → reveals Remember: "Data can change without the signal knowing. Only set()/update() with a new value tells Angular." That's the thing to take home.
5. Read the code: update() gives you the current object (currentUser is just our name for it). ...currentUser copies name and age into a NEW object; age after it overwrites the copy. Name stays Sam.
   New object → different reference → the signal notifies → computed recalculates.
Takeaway: arrays and objects — replace, don't mutate. Arrays: [...items, newItem] instead of items.push(newItem). Same rule as NgRx reducers.
If asked: spread is a shallow copy, nested objects need the same treatment. Templates reading the object directly may still show a mutation on the next check — the point is it's not reliable.
Avoid going into equality functions; that's beyond this session.
Next: recap the three questions from the invite.`,
    },
    {
      id: 'recap',
      title: 'Recap',
      minutes: 2,
      component: RecapSlide,
      notes: `These are the three questions from the invite. Ask each one to the room first, then → reveals the short answer.
What: a wrapper around a value that tells Angular when it changes (signal, read by calling, set/update).
Why: Angular knows who reads what, so a change only concerns its readers (the magic boxes).
How it simplifies: compared with a plain field (Angular has to check) and a BehaviorSubject, you read the value directly, and computed() keeps derived values in sync.
Last step "example": the name comes from a service. Before: subscribe, copy into a field, and remember to unsubscribe in ngOnDestroy — forget it and the subscription outlives the component. After: the service exposes a signal; read name() in the template. Reading a signal creates no subscription, so there's nothing to clean up.
Be precise if asked: ngOnDestroy still exists for other cleanup (timers, listeners). The async pipe already unsubscribed for you; the win is over manual subscribe(). effect() and toSignal() also clean themselves up when the component is destroyed (Part 2).
Replace-don't-mutate was the Test your knowledge quiz; repeat it verbally if time allows.
Share the zip / repo (npm ci, npm start). Invite people to change the examples and play in /lab.`,
    },
    {
      id: 'next',
      title: 'The signal continues…',
      lead: 'Four new ways to connect state, side effects, async data and RxJS.',
      minutes: 1,
      component: NextSlide,
      notes: `Keep it to one line per card — this is a teaser, not a lesson.
effect: the answer to "how do I run code when a signal changes?" — and why angular.dev calls it a last resort.
linkedSignal: like computed, but you can still set it (e.g. a selection that resets when the list changes).
httpResource: HTTP data as signals — value, isLoading, error.
toSignal: a real form dialog, combining form, NgRx and signals.
Questions.`,
    },
  ],
};
