import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CommentDetailsModalComponent } from '@shared/components/datatables/status-renderer/comment-details-modal/comment-details-modal.component';

@Component({
  selector: 'app-status-renderer',
  templateUrl: './status-renderer.component.html',
  styleUrls: ['./status-renderer.component.scss'],
})
export class StatusRendererComponent implements ICellRendererAngularComp, OnInit {
  conservationStatus: string;
  conservationComment: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.conservationStatus = params.data.conservationStatus;
    this.conservationComment = params.data.conservationComment;
  }

  refresh(params: any): boolean {
    return false;
  }

  openStatusDetails() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    const modalRef = this.modalService.open(CommentDetailsModalComponent, ngbModalOptions);
    modalRef.componentInstance.conservationComment = this.conservationComment;
  }
}
