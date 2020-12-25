import { Component, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi, ICellEditorParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { StatusRendererComponent } from '@shared/components/datatables/status-renderer/status-renderer.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddActionModalComponent } from '@app/about/components/item-details/actions/add-action-modal/add-action-modal.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  providers: [DatePipe],
})
export class ActionsComponent implements OnInit {
  frameworkComponent = {
    statusRenderer: StatusRendererComponent,
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
      field: 'constat',
    },
    {
      headerName: 'Etat',
      field: 'status',
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
    },
  ];

  actions = [
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Rendu',
      constat: 'Vu',
      status: 'Voir commentaire',
      comment: 'Voilà un premier commentaire',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Mise en reserve',
      constat: 'Vu',
      status: 'Voir commentaire',
      comment: 'Voilà un deuxième commentaire',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      actionType: 'Inventaire',
      constat: 'Vu',
      status: 'Voir commentaire',
      comment: 'Voilà un troisième commentaire',
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
