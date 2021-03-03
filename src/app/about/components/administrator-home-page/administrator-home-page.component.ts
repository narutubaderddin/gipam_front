import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { BeingCreatedRemarquersActionsRendererComponent } from '@app/@shared/components/datatables/being-created-remarquers-actions-renderer/being-created-remarquers-actions-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@app/@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { VisibleCatalogRendererComponent } from '@app/@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { GridOptions, ColDef, GridApi, ColumnApi, ICellEditorParams } from 'ag-grid-community';

@Component({
  selector: 'app-administrator-home-page',
  templateUrl: './administrator-home-page.component.html',
  styleUrls: ['./administrator-home-page.component.scss'],
})
export class AdministratorHomePageComponent implements OnInit {
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: BeingCreatedRemarquersActionsRendererComponent,
    visibleRenderer: VisibleCatalogRendererComponent,
    detailsLink: RemarquerDetailsLinkRendererComponent,
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
      headerName: 'Titre',
      field: 'titre',
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
      headerName: 'Déposant',
      field: 'depostant',
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
      headerName: 'Style',
      field: 'style',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
    {
      headerName: 'Matière',
      field: 'matiere',
    },
    {
      headerName: 'Dénomination',
      field: 'denomination',
    },
    {
      headerName: 'Epoque',
      field: 'epoque',
    },
    {
      headerName: 'Propriété',
      field: 'property',
    },
    {
      headerName: 'Dimension',
      field: 'dimension',
    },
    {
      headerName: 'Visible catalogue',
      field: 'visible',
      cellRenderer: 'visibleRenderer',
      sortable: false,
      filter: false,
      width: 110,
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
  page = 1;
  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.oeuvres;
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }

  showRemarquer() {
    this.page = 1;
  }

  showProofs() {
    this.page = 2;
  }
  showAlerts() {
    this.page = 3;
  }
}
