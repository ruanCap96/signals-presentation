import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PLAYGROUND_WORKER } from './code-playground';
import { Lab } from './lab';
import { labExamples } from './lab-examples';

describe('Lab', () => {
  it('switches examples and loads their code into the playground', async () => {
    await TestBed.configureTestingModule({
      imports: [Lab],
      providers: [provideRouter([]), { provide: PLAYGROUND_WORKER, useValue: () => undefined }],
    }).compileComponents();
    const fixture = TestBed.createComponent(Lab);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('textarea')!.value).toBe(labExamples[0].code);

    const select = el.querySelector<HTMLSelectElement>('[data-testid="example"]')!;
    select.value = labExamples[1].id;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(el.querySelector('textarea')!.value).toBe(labExamples[1].code);
  });
});
