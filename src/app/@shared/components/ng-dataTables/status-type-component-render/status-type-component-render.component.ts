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
    switch (this.value){
      case 'Dépôt':
        this.class = 'class1';
        break;
      case 'Prorièté':
      case 'Partiellement acceptée':
        this.class = 'class2';
        break;
      case 'Refusée':
        this.class = 'class_refused';
        break;
      case 'Annulée':
        this.class = 'class_canceled';
        break;
      case 'En cours':
        this.class = 'class_in_progress';
        break;
      case 'Acceptée':
        this.class = 'class_accepted';
        break;
    }
  }
}
