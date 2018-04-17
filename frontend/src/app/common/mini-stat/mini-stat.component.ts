import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-stat',
  templateUrl: './mini-stat.component.html',
  styleUrls: ['./mini-stat.component.styl']
})
export class MiniStatComponent {
  @Input() label: string;
  @Input() value: number;

  constructor() {
  }

}
