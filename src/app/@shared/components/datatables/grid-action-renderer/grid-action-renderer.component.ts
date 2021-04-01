import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { ProofsInProgressComponent } from '@app/about/components/administrator-home-page/proofs-in-progress/proofs-in-progress.component';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { InProgressAlertsComponent } from '@app/about/components/administrator-home-page/in-progress-alerts/in-progress-alerts.component';
import { ProofsDetailsComponent } from '@app/about/components/administrator-home-page/proofs-in-progress/proofs-details/proofs-details.component';

@Component({
  selector: 'app-grid-action-renderer',
  templateUrl: './grid-action-renderer.component.html',
  styleUrls: ['./grid-action-renderer.component.scss'],
})
export class GridActionRendererComponent implements ICellRendererAngularComp, OnInit {
  private params: ICellRendererParams;
  actions: string;
  checked: boolean;
  constructor(private WorkOfArtService: WorkOfArtService) {}
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
    } else if (this.params.context.parentComponent instanceof InProgressAlertsComponent) {
      this.actions = 'alert';
    } else if (this.params.context.parentComponent instanceof ProofsDetailsComponent) {
      this.actions = 'proofDetails';
      this.checked = this.params.data.Recole;
    } else {
      this.actions = 'search';
    }
  }
  showDetails() {
    this.params.context.parentComponent.methodFromParent(
      `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`,
      this.params.data.id
    );
  }
}
