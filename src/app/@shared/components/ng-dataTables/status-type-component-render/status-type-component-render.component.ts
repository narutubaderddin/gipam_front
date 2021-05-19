import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-type-component-render',
  templateUrl: './status-type-component-render.component.html',
  styleUrls: ['./status-type-component-render.component.scss'],
})
export class StatusTypeComponentRenderComponent implements OnInit {
  @Input() value: any;
  class: any;

  constructor() {}

  ngOnInit(): void {
    if (typeof this.value === 'object') {
      this.value.statusType == 'DepositStatus' ? (this.value = 'Dépôt') : (this.value = 'Propriété');
    }
    if (this.value == 'Dépôt') {
      this.class = 'class1';
    } else {
      this.class = 'class2';
    }
  }
}
