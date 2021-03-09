import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-type-render',
  templateUrl: './status-type-render.component.html',
  styleUrls: ['./status-type-render.component.scss'],
})
export class StatusTypeRenderComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  class: any;

  constructor() {}

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    if (this.params.value == 'Dépôt') {
      this.class = 'class1';
    } else {
      this.class = 'class2';
    }
    console.log(this.params.value);
  }

  refresh(params: any): boolean {
    return false;
  }
}
