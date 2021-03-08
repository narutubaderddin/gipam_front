import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { GridOptions, ColDef, GridApi, ColumnApi, ICellEditorParams } from 'ag-grid-community';
import { Router } from '@angular/router';

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
      headerName: 'N° inventaire',
      field: 'reference',
      cellRenderer: 'detailsLink',
      sortable: false,
      filter: false,
      width: 90,
      headerTooltip: 'Réf',
      tooltipField: 'reference',
    },
    {
      headerName: 'titre',
      field: 'titre',
    },
    {
      headerName: 'Auteurs',
      field: 'auteur',
    },
    {
      headerName: "Type d'action",
      field: 'actiontype',
    },
    {
      headerName: 'Date début',
      field: 'startDate',
    },
    {
      headerName: 'Date fin',
      field: 'endDate',
    },
    {
      headerName: 'Délai',
      field: 'delai',
    },
    {
      headerName: 'Statut',
      field: 'status',
    },
    {
      headerName: 'Créé par',
      field: 'createdBy',
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
  rowCount: any = 5;
  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.alerts;
  }
  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }
  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
    this.gridApi.paginationSetPageSize(Number(this.rowCount));
  }
}
