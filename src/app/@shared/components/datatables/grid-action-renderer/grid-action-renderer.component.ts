import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { ProofsInProgressComponent } from '@app/about/components/administrator-home-page/proofs-in-progress/proofs-in-progress.component';

@Component({
  selector: 'app-grid-action-renderer',
  templateUrl: './grid-action-renderer.component.html',
  styleUrls: ['./grid-action-renderer.component.scss'],
})
export class GridActionRendererComponent implements ICellRendererAngularComp, OnInit {
  private params: ICellRendererParams;
  actions: string;
  constructor() {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if (this.params.context.parentComponent instanceof ProofsInProgressComponent) {
      this.actions = 'proof';
    } else {
      this.actions = 'alert';
    }
    console.log(this.actions);
  }
}
