import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { StepsHost } from '../shared/steps';
import { Session, sessionLinks } from './session';

@Component({
  selector: 'app-session-shell',
  imports: [NgComponentOutlet, RouterLink, RouterLinkActive],
  templateUrl: './session-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page', '(document:keydown)': 'onKeydown($event)' },
  providers: [StepsHost],
})
export class SessionShell {
  readonly session = input.required<Session>();
  readonly links = sessionLinks;
  readonly slideIndex = signal(0);
  readonly slides = computed(() => this.session().slides);
  readonly slide = computed(() => this.slides()[this.slideIndex()]);
  readonly notesVisible = signal(false);
  readonly progress = computed(() => ((this.slideIndex() + 1) / this.slides().length) * 100);
  /** Bumped to re-create the current slide component, which resets its state. */
  readonly renderKey = signal(0);
  /** Build-up steps of the current slide, if it has any left. */
  readonly steps = inject(StepsHost).active;

  /** Reveals the next build-up step, or moves to the next slide when there is none. */
  forward(): void {
    if (!this.steps()?.next()) this.goTo(this.slideIndex() + 1);
  }

  resetDemo(): void {
    this.renderKey.update((key) => key + 1);
  }

  resetAll(): void {
    this.resetDemo();
    this.notesVisible.set(false);
    this.slideIndex.set(0);
  }

  goTo(index: number): void {
    if (Number.isInteger(index) && index >= 0 && index < this.slides().length) {
      this.slideIndex.set(index);
    }
  }

  chooseSlide(event: Event): void {
    if (event.target instanceof HTMLSelectElement) this.goTo(Number(event.target.value));
  }

  toggleNotes(): void {
    this.notesVisible.update((v) => !v);
  }

  onKeydown(event: KeyboardEvent): void {
    const target = event.target;
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      (target instanceof Element &&
        target.closest('input, select, textarea, button, a, [contenteditable]'))
    ) {
      return;
    }
    const delta = { ArrowRight: 1, PageDown: 1, ' ': 1, ArrowLeft: -1, PageUp: -1 }[event.key];
    if (delta !== undefined) {
      event.preventDefault();
      if (delta === 1) this.forward();
      else this.goTo(this.slideIndex() - 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.goTo(event.key === 'Home' ? 0 : this.slides().length - 1);
    } else if (event.key.toLowerCase() === 'n') {
      this.toggleNotes();
    }
  }
}
