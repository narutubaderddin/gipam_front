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
  status: string;
  comment: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.status = params.data.status;
    this.comment = params.data.comment;
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
    modalRef.componentInstance.comment = this.comment;
  }
}
