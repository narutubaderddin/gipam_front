import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EditActionModalComponent } from '@app/about/components/item-details/actions/edit-action-modal/edit-action-modal.component';

@Component({
  selector: 'app-edit-action-renderer',
  templateUrl: './edit-action-renderer.component.html',
  styleUrls: ['./edit-action-renderer.component.scss'],
})
export class EditActionRendererComponent implements ICellRendererAngularComp, OnInit {
  date: Date;
  observation: string;
  observationExplication: string;
  conservationStatus: string;
  conservationComment: string;
  actionType: string;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    console.log(params.data);
    this.date = params.data.date;
    this.observation = params.data.observation;
    this.observationExplication = params.data.observationExplication;
    this.conservationStatus = params.data.conservationStatus;
    this.conservationComment = params.data.conservationComment;
    this.actionType = params.data.actionType;
  }

  refresh(params: any): boolean {
    return false;
  }

  editAction() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    const modalRef = this.modalService.open(EditActionModalComponent, ngbModalOptions);
    modalRef.componentInstance.date = this.date;
    modalRef.componentInstance.actionType = this.actionType;
    modalRef.componentInstance.observation = this.observation;
    modalRef.componentInstance.observationExplication = this.observationExplication;
    modalRef.componentInstance.conservationStatus = this.conservationStatus;
    modalRef.componentInstance.conservationComment = this.conservationComment;
  }
}
