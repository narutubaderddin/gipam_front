import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { BeingCreatedRemarquersActionsRendererComponent } from '@app/@shared/components/datatables/being-created-remarquers-actions-renderer/being-created-remarquers-actions-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@app/@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { VisibleCatalogRendererComponent } from '@app/@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { GridOptions, ColDef, GridApi, ColumnApi, ICellEditorParams } from 'ag-grid-community';
import { StatusTypeRenderComponent } from '@shared/components/datatables/status-type-render/status-type-render.component';

@Component({
  selector: 'app-administrator-home-page',
  templateUrl: './administrator-home-page.component.html',
  styleUrls: ['./administrator-home-page.component.scss'],
})
export class AdministratorHomePageComponent implements OnInit {
  imageObject: Array<object> = [
    {
      image: 'assets/images/1.jpg',
      thumbImage: 'assets/images/1.jpg',
      alt: 'alt of image',
      title: 'title of image',
    },
    {
      image: 'assets/images/2.jpg',
      thumbImage: 'assets/images/2.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/9.jpg',
      thumbImage: 'assets/images/9.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/4.jpg',
      thumbImage: 'assets/images/4.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/12.jpg',
      thumbImage: 'assets/images/12.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/24.jpg',
      thumbImage: 'assets/images/24.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/25.jpg',
      thumbImage: 'assets/images/25.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
  ];
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
  remarquers: any[] = [];

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
  page = 1;
  rowCount: any = 5;
  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    // this.remarquers = this.WorkOfArtService.oeuvres;
    this.remarquers = this.WorkOfArtService.oeuvres[0].items;
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

  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
    this.gridApi.paginationSetPageSize(Number(this.rowCount));
  }
}
