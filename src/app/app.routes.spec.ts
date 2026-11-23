import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { SessionShell } from './shell/session-shell';
import { part1 } from './sessions/part-1/part-1.session';
import { part2 } from './sessions/part-2/part-2.session';
import { Lab } from './lab/lab';
import { withComponentInputBinding } from '@angular/router';

describe('routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
  });

  it('redirects to Part 1 and binds the session', async () => {
    const shell = await harness.navigateByUrl('/', SessionShell);
    expect(TestBed.inject(Router).url).toBe('/part-1');
    expect(shell.session()).toBe(part1);
  });

  it('loads Part 2 and the lab', async () => {
    expect((await harness.navigateByUrl('/part-2', SessionShell)).session()).toBe(part2);
    expect(await harness.navigateByUrl('/lab', Lab)).toBeInstanceOf(Lab);
  });
});
