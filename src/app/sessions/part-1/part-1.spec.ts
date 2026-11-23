import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SessionShell } from '../../shell/session-shell';
import { totalMinutes } from '../../shell/session';
import { part1 } from './part-1.session';

describe('Part 1 session', () => {
  let fixture: ComponentFixture<SessionShell>;
  let shell: SessionShell;
  let el: HTMLElement;

  const q = (id: string) => el.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
  const text = (id: string) => q(id).textContent?.trim();

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function open(id: string) {
    shell.goTo(part1.slides.findIndex((s) => s.id === id));
    await render();
  }

  async function click(id: string) {
    q(id).click();
    await render();
  }

  /** Clicks "Next step" until the slide has revealed everything. */
  async function revealAll() {
    while (q('next-step')) await click('next-step');
  }

  async function type(code: string) {
    const editor = q('live-code') as HTMLTextAreaElement;
    editor.value = code;
    editor.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 350));
    await render();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionShell],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionShell);
    fixture.componentRef.setInput('session', part1);
    shell = fixture.componentInstance;
    el = fixture.nativeElement;
    await render();
  });

  it('plans ~23 minutes with unique slide ids, leaving time for questions', () => {
    expect(totalMinutes(part1)).toBe(23);
    expect(new Set(part1.slides.map((s) => s.id)).size).toBe(part1.slides.length);
  });

  it('renders the intro hero without a slide header', () => {
    expect(el.querySelector('.hero h1')?.textContent).toContain('Signals');
    expect(el.querySelector('.slide-head')).toBeNull();
  });

  it('builds up the What example step by step', async () => {
    await open('what');
    const code = () => (q('live-code') as HTMLTextAreaElement).value;
    expect(code()).toContain("const firstName = signal('Morgan');");
    expect(code()).not.toContain('function rename');
    expect(text('what-value')).toBe('Morgan');
    expect(q('what-set')).toBeNull();
    expect(text('next-step')).toContain('rename()');

    await click('next-step');
    expect(code()).toContain('function rename');
    expect(code()).not.toContain('function shout');
    expect(q('what-update')).toBeNull();
    await click('what-set');
    expect(text('what-value')).toBe('Jaime');

    await click('next-step');
    expect(code()).toContain('function shout');
    expect(q('next-step')).toBeNull();
    // Adding a step re-runs the code, so the value starts from 'Morgan' again.
    expect(text('what-value')).toBe('Morgan');
    await click('what-update');
    expect(text('what-value')).toBe('MORGAN');
  });

  it('keeps live edits when the next step is added', async () => {
    await open('what');
    await type((q('live-code') as HTMLTextAreaElement).value.replace("'Morgan'", "'Riley'"));
    await click('next-step');
    expect((q('live-code') as HTMLTextAreaElement).value).toContain("signal('Riley')");
    expect(text('what-value')).toBe('Riley');
    expect(q('reset-code').hasAttribute('disabled')).toBe(false);
  });

  it('runs the Essentials firstName example and resets the demo', async () => {
    await open('what');
    await revealAll();
    expect(text('what-value')).toBe('Morgan');
    await click('what-set');
    expect(text('what-value')).toBe('Jaime');
    await click('what-set');
    expect(text('what-value')).toBe('Morgan');
    await click('what-update');
    expect(text('what-value')).toBe('MORGAN');
    await click('what-set');
    expect(text('what-value')).toBe('Jaime');
    await click('reset');
    expect(text('what-value')).toBe('Morgan');
    expect(q('what-set')).toBeNull();

    await revealAll();
    await type((q('live-code') as HTMLTextAreaElement).value.replace("'Jaime'", "'Alex'"));
    expect(text('what-value')).toBe('Morgan');
    await click('what-set');
    expect(text('what-value')).toBe('Alex');

    await type((q('live-code') as HTMLTextAreaElement).value.replace("'Morgan'", "'Riley'"));
    expect(text('what-value')).toBe('Riley');
  });

  it('links introductory concepts to Essentials and the gotcha to the deeper guide', async () => {
    for (const id of ['what', 'why', 'before-after', 'rxjs', 'computed', 'where']) {
      await open(id);
      const links = el.querySelectorAll<HTMLAnchorElement>('.definition-source');
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.href).toMatch(/^https:\/\/angular\.dev\/essentials\/signals(?:#|$)/);
      }
    }
    await open('gotcha');
    expect(el.querySelector<HTMLAnchorElement>('.definition-source')?.href).toBe(
      'https://angular.dev/guide/signals#signal-equality-functions',
    );
  });

  it('shows that only the readers of a changed signal update', async () => {
    await open('why');
    expect(text('reader-Greeting')).toContain('Hi, Ada');
    expect(text('verdict')).toContain('Click a box');

    await click('box-age');
    expect(text('box-age')).toContain('31');
    expect(text('verdict')).toContain('Nobody here');
    expect(q('reader-Greeting').dataset['flash']).toBeUndefined();
    expect(q('reader-Theme').dataset['flash']).toBeUndefined();

    await click('box-name');
    expect(text('reader-Greeting')).toContain('Hi, Bo');
    expect(text('verdict')).toContain('Greeting updates');
    expect(q('reader-Greeting').dataset['flash']).toBeDefined();
    expect(q('reader-Theme').dataset['flash']).toBeUndefined();

    await click('box-theme');
    expect(text('reader-Theme')).toContain('light mode');
    expect(q('reader-Greeting').dataset['flash']).toBeUndefined();
  });

  it('contrasts a plain field with a signal', async () => {
    await open('before-after');
    expect(el.querySelectorAll('.compare article')).toHaveLength(2);
    expect(el.textContent).toContain('this.age = 31;');
    expect(el.textContent).toContain('this.age.set(31);');
    expect(text('flow-before')).toContain('Check broadly');
    expect(text('flow-now')).toContain('This view reads age');
  });

  it('compares an Observable with a signal', async () => {
    await open('rxjs');
    expect(el.querySelectorAll('.compare article')).toHaveLength(2);
    expect(el.querySelectorAll('.compare app-code')).toHaveLength(6);
    expect(el.textContent).toContain("this.name$.next('Bo')");
    expect(el.textContent).toContain("this.name.set('Bo')");
  });

  it('runs the computed slide from its editable code and shows errors', async () => {
    await open('computed');
    expect(q('full-name')).toBeNull();
    await click('next-step');
    expect(text('full-name')).toBe('Maya Jensen');
    expect(q('rename')).toBeNull();
    await click('next-step');
    await click('rename');
    expect(text('first-name')).toBe('Theo');
    expect(text('full-name')).toBe('Theo Jensen');

    const code = (q('live-code') as HTMLTextAreaElement).value;
    await type(code.replace("firstName.set('Theo')", "lastName.set('Okafor')"));
    expect(text('full-name')).toBe('Maya Jensen');
    await click('rename');
    expect(text('full-name')).toBe('Maya Okafor');

    await type(`${code}\nfullName.set('X');`);
    expect(text('live-error')).toContain('fullName.set is not a function');

    await click('reset-code');
    expect(q('live-error')).toBeNull();
    expect(text('full-name')).toBe('Maya Jensen');
  });

  it('discards live-code edits on Reset demo and when leaving the slide', async () => {
    await open('what');
    const original = (q('live-code') as HTMLTextAreaElement).value;
    await type(original.replace("'Morgan'", "'Riley'"));
    expect(text('what-value')).toBe('Riley');
    await click('reset');
    expect((q('live-code') as HTMLTextAreaElement).value).toBe(original);
    expect(text('what-value')).toBe('Morgan');

    await revealAll();
    await click('what-set');
    await open('computed');
    await open('what');
    expect(text('what-value')).toBe('Morgan');
  });

  it('resets the current slide with Reset demo', async () => {
    await open('gotcha');
    await click('replace');
    expect(text('user-age')).toBe('31');
    await click('reset');
    expect(text('user-age')).toBe('30');
  });

  it('dismisses and restores the notification', async () => {
    await open('where');
    expect(el.querySelectorAll('.where app-code')).toHaveLength(3);
    expect(el.querySelector('h1')?.textContent).toContain('Who uses signals');
    await click('dismiss');
    expect(q('notice')).toBeNull();
    await click('show-again');
    expect(q('notice')).not.toBeNull();
  });

  it('shows that object mutation leaves the computed cached but replacement notifies', async () => {
    await open('gotcha');
    expect(el.querySelector('h1')?.textContent).toContain('Test your knowledge');
    expect(q('hint').classList).not.toContain('step-hidden');
    expect(text('hint')).toContain('only notices a NEW value');
    expect(q('remember').classList).toContain('step-hidden');
    await revealAll();
    expect(q('remember').classList).not.toContain('step-hidden');
    expect(el.textContent).toContain("user = signal({ name: 'Sam', age: 30 });");
    expect(el.textContent).toContain('age = computed(() => this.user().age);');
    expect(text('user-age')).toBe('30');
    await click('mutate');
    expect(text('user-age')).toBe('30');
    await click('replace');
    expect(text('user-age')).toBe('32');
    expect(text('user-name')).toBe('Sam');
    await click('replace');
    expect(text('user-age')).toBe('33');
    expect(text('user-name')).toBe('Sam');
  });

  it('recaps the invite questions, revealing one answer per step', async () => {
    await open('recap');
    expect(el.querySelectorAll('.qa dt').length).toBe(3);
    const hidden = () =>
      ['answer-what', 'answer-why', 'answer-how'].map((id) =>
        q(id).classList.contains('step-hidden'),
      );
    expect(hidden()).toEqual([true, true, true]);
    await click('next-step');
    expect(hidden()).toEqual([false, true, true]);
    await click('next-step');
    await click('next-step');
    expect(hidden()).toEqual([false, false, false]);
    expect(q('recap-example').classList).toContain('step-hidden');
    await click('next-step');
    expect(q('recap-example').classList).not.toContain('step-hidden');
    expect(q('next-step')).toBeNull();
  });

  it('reveals build-up steps with → before moving to the next slide', async () => {
    await open('before-after');
    const after = () => el.querySelectorAll('.compare article')[1];
    expect(after().classList).toContain('step-hidden');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await render();
    expect(shell.slide().id).toBe('before-after');
    expect(after().classList).not.toContain('step-hidden');
    expect(q('next-step')).toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await render();
    expect(shell.slide().id).toBe('why');
  });

  it('navigates with the keyboard and ignores modified keys', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(shell.slideIndex()).toBe(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', metaKey: true }));
    expect(shell.slideIndex()).toBe(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(shell.slideIndex()).toBe(part1.slides.length - 1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(shell.slideIndex()).toBe(0);
    shell.goTo(99);
    expect(shell.slideIndex()).toBe(0);
  });

  it('does not navigate or toggle notes while typing in the live editor', async () => {
    await open('computed');
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'n']) {
      q('live-code').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
    expect(shell.slide().id).toBe('computed');
    expect(shell.notesVisible()).toBe(false);
  });

  it('toggles presenter notes', async () => {
    expect(q('notes')).toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    await render();
    expect(text('notes')).toContain('Goal');
  });

  it('restarts the session', async () => {
    await open('where');
    await click('dismiss');
    shell.notesVisible.set(true);
    await click('restart');
    expect(shell.slideIndex()).toBe(0);
    expect(shell.notesVisible()).toBe(false);
    await open('where');
    expect(q('notice')).not.toBeNull();
  });
});
