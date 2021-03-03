import { RemarquerDetailsLinkRendererComponent } from '@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { Router } from '@angular/router';
import { VisibleCatalogRendererComponent } from '@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import {
  ColDef,
  ColumnApi,
  GridApi,
  ICellEditorParams,
  Column,
  GridOptions,
  CellClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ColumnFilterService, OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnFilterModel } from '@shared/models/column-filter-model';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';

@Component({
  selector: 'app-list-work-of-arts',
  templateUrl: './list-work-of-arts.component.html',
  styleUrls: ['./list-work-of-arts.component.scss'],
})
export class ListWorkOfArtsComponent implements OnInit {
  isCollapsed = true;
  showDatatable = false;
  data = false;
  mode = 'liste';
  filterFormGroup: FormGroup;
  columnDropped = new EventEmitter();
  columnDroppedSubscription: Subscription;
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: GridActionRendererComponent,
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
    onDragStopped: () => {
      this.columnDropped.next();
    },
    onColumnMoved: (_) => {
      if (this.columnDroppedSubscription) {
        this.columnDroppedSubscription.unsubscribe();
      }
      this.columnDroppedSubscription = this.columnDropped.pipe(first()).subscribe(() => {
        this.updateColumnsConfiguration();
      });
    },
  };
  oeuvres = this.WorkOfArtService.oeuvres;

  ColDef: ColDef[] = [
    {
      cellClass: 'link',
      headerName: 'N°',
      field: 'id',
      cellRenderer: 'detailsLink',
      checkboxSelection: true,
      headerCheckboxSelection: true,
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
  selectedRowCount = 0;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  currentColumnStates: any;
  columns: any;
  currentFilters: ColumnFilterModel[] = [];
  currentOrderedFields: { column: string; direction: string }[] = [];
  paginatorLoading: boolean;
  oeuvreToShow: any;

  constructor(
    private fb: FormBuilder,
    public columnFilterService: ColumnFilterService,
    private WorkOfArtService: WorkOfArtService,
    private router: Router
  ) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.oeuvreToShow = this.oeuvres;
    this.initFilterFormGroup();
    this.gridOptions.tooltipShowDelay = 0;
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
    this.currentColumnStates = this.gridColumnApi.getColumnState();

    this.columns = this.gridColumnApi.getAllColumns();
    this.columns.splice(0, 2);
  }
  onRowSelected(event: any) {
    if (event.node.selected == true) {
      this.selectedRowCount++;
    }
    if (event.node.selected == false) {
      this.selectedRowCount--;
    }
    console.log(this.selectedRowCount);
  }

  onHeaderToggle(column: Column): void {
    // hide column and reset filters
    this.gridColumnApi.setColumnVisible(column.getColId(), !column.isVisible());
    // this.gridApi.sizeColumnsToFit();
    this.gridApi.setFilterModel(null);
    this.updateColumnsConfiguration('visibility');
  }

  initFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      titre: '',
    });
  }

  updateColumnsConfiguration(type: string = 'position') {
    let successMessage: string;
    let errorMessage: string;
    if (type === 'position') {
      successMessage = 'actions.update_column_order_success';
      errorMessage = 'actions.update_column_order_error';
    } else {
      successMessage = 'actions.update_column_order_visibility_success';
      errorMessage = 'actions.update_column_order_visibility_error';
    }
    this.currentColumnStates = this.gridColumnApi.getColumnState();
  }

  updateFilteredData(columnFilters: ColumnFilterModel[]) {
    this.currentFilters = this.columnFilterService.updateCurrentFilter(this.currentFilters, columnFilters);
    columnFilters.forEach((value: any) => {
      this.oeuvreToShow = this.oeuvreToShow.filter((oeuvre: any) => {
        let column = value.column;
        if (value.value instanceof Array) {
          return oeuvre[column].toUpperCase().includes(value.value[0].toUpperCase());
        } else {
          return oeuvre[column].toUpperCase().includes(value.value.toUpperCase());
        }
      });
    });
  }

  updateSortedData(column: string, direction: string) {
    this.currentOrderedFields = [{ column, direction }];
  }

  getOrdersData(page: number = 1) {
    this.paginatorLoading = true;
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  search(event?: any) {
    if (event.target.value.length > 0) {
      this.oeuvreToShow = this.oeuvres.filter((x: any) =>
        x.titre.toUpperCase().includes(event.target.value.toUpperCase())
      );
    } else {
      this.oeuvreToShow = this.oeuvres;
    }
  }

  resetFilter() {
    this.oeuvreToShow = this.oeuvres;
  }

  openCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onCellClicked(event: any) {
    if (event.column.colId == 'FirstName') {
      // only first column clicked
      // execute the action as you want here in on click of hyperlink
    }
  }

  //add movable objects
  addPropertyMovableObject() {
    this.router.navigate(['add-property-remarquer']);
  }

  addDepositMovableObject() {}

  //validate request value
  onValidateRequest(value: boolean) {
    if (value) {
      this.showDatatable = true;
      this.isCollapsed = false;
    }
  }
}
