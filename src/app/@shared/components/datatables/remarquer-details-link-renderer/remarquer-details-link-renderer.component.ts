import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-remarquer-details-link-renderer',
  templateUrl: './remarquer-details-link-renderer.component.html',
  styleUrls: ['./remarquer-details-link-renderer.component.scss'],
})
export class RemarquerDetailsLinkRendererComponent implements ICellRendererAngularComp, OnInit {
  params: ICellRendererParams;

  constructor() {}
  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}
}
