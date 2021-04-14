import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeingCreatedRemarquersActionsRendererComponent } from '@app/@shared/components/datatables/being-created-remarquers-actions-renderer/being-created-remarquers-actions-renderer.component';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@app/@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { StatusTypeRenderComponent } from '@app/@shared/components/datatables/status-type-render/status-type-render.component';
import { VisibleCatalogRendererComponent } from '@app/@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { GridOptions, ColDef, GridApi, ColumnApi, ICellEditorParams } from 'ag-grid-community';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
})
export class NoticeListComponent implements OnInit {
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
      cellClass: 'link',
      headerName: 'N° inventaire',
      field: 'id',
      cellRenderer: 'detailsLink',
      sortable: false,
      filter: false,
      width: 90,
    },
    {
      headerName: 'Titre',
      field: 'titre',
    },
    {
      headerName: 'Domaine',
      field: 'domaine',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.list,
        list: this.WorkOfArtService.domaine,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: 'Dénomination',
      field: 'denomination',
    },
    {
      headerName: 'Matière',
      field: 'matiere',
    },
    {
      headerName: 'Style',
      field: 'style',
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
      headerName: 'Type de Statut',
      field: 'property',
      cellRenderer: 'statusTypeRender',
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
    this.remarquers = this.WorkOfArtService.oeuvres[0].items;
    this.filter = this.activatedRoute.snapshot.queryParams['filter'].length > 0;
    console.log(this.filter);
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
