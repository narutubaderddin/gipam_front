import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddActionModalComponent } from '@app/about/components/item-details/actions/add-action-modal/add-action-modal.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  providers: [DatePipe],
})
export class ActionsComponent implements OnInit {
  detailCellRendererParams: any;

  // @ts-ignore
  columnDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Responsable',
      field: 'responsable',
    },
    {
      headerName: 'Constat',
      field: 'observation',
    },
    {
      headerName: 'Conservation',
      field: 'conservation',
    },
    {
      headerName: 'Etat de conservation',
      field: 'conservationStatus',
      cellRenderer: 'statusRenderer',
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
  gridReady = false;
  constructor(private datePipe: DatePipe, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          {
            headerName: 'Type action',
            field: 'actionType',
          },
          { field: 'direction' },
          {
            field: 'number',
            minWidth: 150,
          },
          {
            field: 'switchCode',
            minWidth: 150,
          },
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: function (params: any) {
        params.successCallback(params.data.callRecords);
      },
    };
  }

  addAction() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    this.modalService.open(AddActionModalComponent, ngbModalOptions);
  }
}
