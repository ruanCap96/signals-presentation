import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-part-2-intro-slide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './intro.slide.html',
})
export class Part2IntroSlide {}
