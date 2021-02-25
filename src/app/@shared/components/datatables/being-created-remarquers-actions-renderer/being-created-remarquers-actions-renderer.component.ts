import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-being-created-remarquers-actions-renderer',
  templateUrl: './being-created-remarquers-actions-renderer.component.html',
  styleUrls: ['./being-created-remarquers-actions-renderer.component.scss'],
})
export class BeingCreatedRemarquersActionsRendererComponent implements ICellRendererAngularComp, OnInit {
  constructor() {}
  ngOnInit(): void {}
  agInit(params: ICellRendererParams): void {}

  refresh(params: any): boolean {
    return false;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
}
