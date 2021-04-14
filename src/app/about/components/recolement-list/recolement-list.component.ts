import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { BeingCreatedRemarquersActionsRendererComponent } from '@shared/components/datatables/being-created-remarquers-actions-renderer/being-created-remarquers-actions-renderer.component';
import { VisibleCatalogRendererComponent } from '@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { StatusTypeRenderComponent } from '@shared/components/datatables/status-type-render/status-type-render.component';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColDef, ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-recolement-list',
  templateUrl: './recolement-list.component.html',
  styleUrls: ['./recolement-list.component.scss'],
})
export class RecolementListComponent implements OnInit {
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: BeingCreatedRemarquersActionsRendererComponent,
    visibleRenderer: VisibleCatalogRendererComponent,
    detailsLink: RemarquerDetailsLinkRendererComponent,
    statusTypeRender: StatusTypeRenderComponent,
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
  leftPinnedCols: string[] = ['id'];

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  rowCount: any = 5;
  filter: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private WorkOfArtService: WorkOfArtService
  ) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.proofs;
    this.filter =
      this.activatedRoute.snapshot.queryParams['filter'] &&
      this.activatedRoute.snapshot.queryParams['filter'].length > 0;
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

  resetFilter() {}
}
