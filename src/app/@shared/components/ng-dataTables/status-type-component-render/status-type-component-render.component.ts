import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-type-component-render',
  templateUrl: './status-type-component-render.component.html',
  styleUrls: ['./status-type-component-render.component.scss'],
})
export class StatusTypeComponentRenderComponent implements OnInit {
  @Input() value: string = '';
  class: any;

  constructor() {}

  ngOnInit(): void {
    if (this.value == 'Dépôt') {
      this.class = 'class1';
    } else {
      this.class = 'class2';
    }
  }
}
