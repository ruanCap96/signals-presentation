import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-intro-slide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './intro.slide.html',
})
export class IntroSlide {}
