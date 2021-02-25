import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { GridOptions, ColDef, GridApi, ColumnApi, ICellEditorParams } from 'ag-grid-community';

@Component({
  selector: 'app-in-progress-alerts',
  templateUrl: './in-progress-alerts.component.html',
  styleUrls: ['./in-progress-alerts.component.scss'],
})
export class InProgressAlertsComponent implements OnInit {
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: GridActionRendererComponent,
  };
  defaultColDef = {
    headerComponent: 'customHeader',
    sortable: true,
    filter: true,
    resizable: true,
    headerValueGetter: (params: any) => {
      return params.colDef.headerName;
    },
    headerComponentParams: {
      menuIcon: 'fa-filter',
      operator: OPERATORS.like,
      type: TYPES.text,
    },
  };
  gridOptions: GridOptions = {
    suppressLoadingOverlay: false,
    suppressScrollOnNewData: true,
  };
  remarquers: any;

  ColDef: ColDef[] = [
    {
      cellClass: 'link',
      headerName: 'Réf',
      field: 'id',
      cellRenderer: 'detailsLink',
      sortable: false,
      filter: false,
      width: 70,
    },
    {
      headerName: 'Date création',
      field: 'creationDate',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.date,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: "Type d'action",
      field: 'depostant',
    },
    {
      headerName: 'Date début',
      field: 'style',
    },
    {
      headerName: 'Date fin',
      field: 'type',
    },
    {
      headerName: 'Délai',
      field: 'matiere',
    },
    {
      headerName: 'Statut',
      field: 'denomination',
    },
    {
      headerName: 'Créé par',
      field: 'epoque',
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 130,
    },
  ];

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  constructor() {}
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {}
  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }
}
