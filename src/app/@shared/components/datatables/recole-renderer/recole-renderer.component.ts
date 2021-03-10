import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-recole-renderer',
  templateUrl: './recole-renderer.component.html',
  styleUrls: ['./recole-renderer.component.scss'],
})
export class RecoleRendererComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  class: any;

  constructor() {}

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    console.log(this.params.value);
  }

  refresh(params: any): boolean {
    return false;
  }
}
