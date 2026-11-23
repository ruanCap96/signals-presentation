import { Type } from '@angular/core';

export interface Slide {
  id: string;
  title: string;
  lead?: string;
  minutes: number;
  /** Shows the "Reset demo" button, which re-creates the slide component. */
  interactive?: boolean;
  /** Full-screen slide without the title header. */
  hero?: boolean;
  notes: string;
  component: Type<unknown>;
}

export interface Session {
  id: string;
  title: string;
  slides: readonly Slide[];
}

export const totalMinutes = (session: Session) =>
  session.slides.reduce((sum, s) => sum + s.minutes, 0);

export const sessionLinks = [
  { path: '/part-1', label: 'Part 1' },
  { path: '/part-2', label: 'Part 2' },
  { path: '/lab', label: 'Lab' },
] as const;
