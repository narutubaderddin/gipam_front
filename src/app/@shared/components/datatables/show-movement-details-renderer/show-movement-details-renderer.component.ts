import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-show-movement-details-renderer',
  templateUrl: './show-movement-details-renderer.component.html',
  styleUrls: ['./show-movement-details-renderer.component.scss'],
})
export class ShowMovementDetailsRendererComponent implements ICellRendererAngularComp, OnInit {
  constructor() {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {}

  refresh(params: any): boolean {
    return false;
  }
}
