import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SessionShell } from '../../shell/session-shell';
import { part2 } from './part-2.session';

describe('Part 2 session (draft)', () => {
  let fixture: ComponentFixture<SessionShell>;
  let el: HTMLElement;

  const q = (id: string) => el.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
  const text = (id: string) => q(id).textContent?.trim();

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function click(id: string) {
    q(id).click();
    await render();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionShell],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionShell);
    fixture.componentRef.setInput('session', part2);
    el = fixture.nativeElement;
    fixture.componentInstance.goTo(part2.slides.findIndex((s) => s.id === 'subjects'));
    await render();
  });

  it('has unique slide ids', () => {
    expect(new Set(part2.slides.map((s) => s.id)).size).toBe(part2.slides.length);
  });

  it('shows what late subscribers receive', async () => {
    await click('next');
    await click('next');
    await click('subscribe');
    expect(text('subject-log')).toBe('—');
    expect(text('behavior-log')).toBe('2');
    await click('next');
    expect(text('subject-log')).toBe('3');
    expect(text('behavior-log')).toBe('2, 3');
  });

  it('drops late subscribers on reset', async () => {
    await click('subscribe');
    await click('reset');
    expect((q('subscribe') as HTMLButtonElement).disabled).toBe(false);
    await click('next');
    expect(text('subject-log')).toBe('—');
    expect(text('behavior-log')).toBe('—');
  });

  for (const [invalid, saving] of [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ]) {
    it(`agrees on disabled for invalid=${invalid} saving=${saving}`, async () => {
      fixture.componentInstance.goTo(part2.slides.findIndex((s) => s.id === 'derived-vs'));
      await render();
      for (const [id, checked] of [
        ['invalid', invalid],
        ['saving', saving],
      ] as const) {
        const box = q(id) as HTMLInputElement;
        box.checked = checked;
        box.dispatchEvent(new Event('change'));
        await render();
      }
      const expected = invalid || saving;
      expect((q('save-rx') as HTMLButtonElement).disabled).toBe(expected);
      expect((q('save-signal') as HTMLButtonElement).disabled).toBe(expected);
    });
  }
});
