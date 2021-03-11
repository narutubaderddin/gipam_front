import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit, Input } from '@angular/core';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { RemarquerDetailsLinkRendererComponent } from '@app/@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { VisibleCatalogRendererComponent } from '@app/@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proofs-details',
  templateUrl: './proofs-details.component.html',
  styleUrls: ['./proofs-details.component.scss'],
})
export class ProofsDetailsComponent implements OnInit {
  @Input() show: boolean;
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    //   gridActionRenderer: GridActionRendererComponent,
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
    suppressScrollOnNewData: false,

    // pagination: true,
    // paginationPageSize: 2,
  };
  remarquers: any;

  ColDef: ColDef[] = [
    {
      headerName: 'N° inventaire',
      field: 'inventaire',
      headerTooltip: 'N° inventaire',
      width: 90,
    },
    {
      headerName: 'Titre',
      field: 'titre',
      headerTooltip: 'Titre',
      width: 90,
    },
    {
      headerName: 'Domaine',
      field: 'Domaine',
      width: 90,
    },
    {
      headerName: 'Dénomination',
      field: 'Denomination',
      width: 90,
    },
    {
      headerName: 'Auteur',
      field: 'Auteur',
      width: 90,
    },
    {
      headerName: 'Total récolement',
      field: 'total_recole',
      width: 90,
    },
    {
      headerName: 'Date dernier récolement',
      field: 'Date_last_recole',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.date,
        operator: OPERATORS.in,
      },
      width: 90,
    },
    {
      headerName: 'Récolé',
      field: 'Recole',
      width: 90,
    },
    {
      headerName: 'Actions',
      field: 'action',
      // cellRenderer: 'gridActionRenderer',

      sortable: false,
      filter: false,
      width: 70,
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
    this.remarquers = this.WorkOfArtService.proofsDetails;
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }
  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
  }
}
