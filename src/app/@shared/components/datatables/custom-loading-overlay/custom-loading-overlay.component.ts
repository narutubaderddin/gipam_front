import { Component, OnInit } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-loading-overlay',
  templateUrl: './custom-loading-overlay.component.html',
  styleUrls: ['./custom-loading-overlay.component.scss'],
})
export class CustomLoadingOverlayComponent implements ILoadingOverlayAngularComp {
  private params: any;

  constructor() {}

  agInit(params: ILoadingOverlayParams): void {
    this.params = params;
  }
}
