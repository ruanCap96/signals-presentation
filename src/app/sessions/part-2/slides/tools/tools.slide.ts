import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tools-slide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'slide-body' },
  templateUrl: './tools.slide.html',
})
export class ToolsSlide {}
