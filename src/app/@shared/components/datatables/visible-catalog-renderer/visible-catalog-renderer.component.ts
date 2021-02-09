import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-visible-catalog-renderer',
  templateUrl: './visible-catalog-renderer.component.html',
  styleUrls: ['./visible-catalog-renderer.component.scss'],
})
export class VisibleCatalogRendererComponent implements ICellRendererAngularComp, OnInit {
  visible: boolean;

  constructor() {}
  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.visible = params.data.visible;
  }
}
