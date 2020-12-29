import { Component, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi, ICellEditorParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { StatusRendererComponent } from '@shared/components/datatables/status-renderer/status-renderer.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddActionModalComponent } from '@app/about/components/item-details/actions/add-action-modal/add-action-modal.component';
import { EditActionRendererComponent } from '@shared/components/datatables/edit-action-renderer/edit-action-renderer.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  providers: [DatePipe],
})
export class ActionsComponent implements OnInit {
  frameworkComponent = {
    statusRenderer: StatusRendererComponent,
    editActionRenderer: EditActionRendererComponent,
  };
  // @ts-ignore
  columnDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
    },
    {
      headerName: 'Type action',
      field: 'actionType',
    },
    {
      headerName: 'Constat',
      field: 'observation',
    },
    {
      headerName: 'Etat',
      field: 'conservationStatus',
      cellRenderer: 'statusRenderer',
      tooltipValueGetter: (value) => {
        if (value.data.status === 'Voir commentaire') {
          return value.data.status;
        }
      },
    },
    {
      headerName: 'Action',
      flex: 0.5,
      cellRenderer: 'editActionRenderer',
    },
  ];

  actions = [
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Rendu',
      conservationStatus: 'Voir commentaire',
      conservationComment: 'Voilà un premier commentaire',
      observation: 'Vu',
      observationExplication: 'Retrouvé',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Mise en reserve',
      conservationStatus: 'Voir commentaire',
      conservationComment: 'Voilà un deuxième commentaire',
      observation: 'Vu',
      observationExplication: 'Retrouvé',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Inventaire',
      conservationStatus: 'Voir commentaire',
      conservationComment: 'Voilà un troisième commentaire',
      observation: 'Vu',
      observationExplication: 'Retrouvé',
    },
  ];
  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
  };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  constructor(private datePipe: DatePipe, private modalService: NgbModal) {}

  ngOnInit(): void {}

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }

  addAction() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    this.modalService.open(AddActionModalComponent, ngbModalOptions);
  }
}
