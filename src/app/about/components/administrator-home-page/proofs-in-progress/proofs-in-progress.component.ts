import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@app/@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { VisibleCatalogRendererComponent } from '@app/@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { ColDef, ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proofs-in-progress',
  templateUrl: './proofs-in-progress.component.html',
  styleUrls: ['./proofs-in-progress.component.scss'],
})
export class ProofsInProgressComponent implements OnInit {
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
      headerName: 'Titre de récolement ',
      field: 'titre',
      headerTooltip: 'Titre de récolement',
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
      width: 90,
    },
    {
      headerName: "Nombre d'oeuvres à récoler",
      field: 'nombre_prood_a_recole',
      width: 50,
    },
    {
      headerName: "Nombre d'oeuvres récolées",
      field: 'nombre_prood_recole',
      width: 50,
    },
    {
      headerName: 'Créé par',
      field: 'created_by',
      width: 70,
    },
    {
      headerName: 'Ministère',
      field: 'minister',
      width: 185,
    },
    {
      headerName: 'Etab/Dir.',
      field: 'etab',
      width: 185,
    },
    {
      headerName: 'Service',
      field: 'service',
      width: 185,
    },
    {
      headerName: 'Site',
      field: 'service',
      width: 185,
    },
    {
      headerName: 'Bâtiment ',
      field: 'service',
      width: 182,
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 100,
    },
  ];
  pinnedCols: string[] = ['action'];
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  rowCount: any = 5;

  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.proofs;
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
