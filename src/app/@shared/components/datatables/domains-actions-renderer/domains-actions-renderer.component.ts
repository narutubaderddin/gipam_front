import { Component, OnInit } from '@angular/core';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-domains-actions-renderer',
  templateUrl: './domains-actions-renderer.component.html',
  styleUrls: ['./domains-actions-renderer.component.scss'],
})
export class DomainsActionsRendererComponent implements ICellRendererAngularComp, OnInit {
  private data: ICellRendererParams;
  active: boolean = true;
  private params: ICellRendererParams;
  constructor() {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.active = params.data.active;
    console.log(params);
  }

  refresh(params: any): boolean {
    return false;
  }

  modalEdit() {
    console.log(this.params);

    this.params.context.parentComponent.openModal(this.params.data);
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
  ChangeVisibility(e: any) {
    this.active = !this.active;
    this.params.context.parentComponent.visibleDomain(this.params.data);
  }
  delete() {
    this.params.context.parentComponent.deleteItem(this.params.data);
  }
}
