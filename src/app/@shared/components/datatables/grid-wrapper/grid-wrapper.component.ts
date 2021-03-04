import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowDataChangedEvent } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { CustomLoadingOverlayComponent } from '@shared/components/datatables/custom-loading-overlay/custom-loading-overlay.component';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
@Component({
  selector: 'app-grid-wrapper',
  templateUrl: './grid-wrapper.component.html',
  styleUrls: ['./grid-wrapper.component.scss'],
})
export class GridWrapperComponent implements OnInit {
  @Input() columnDefs: ColDef[];
  @Input() defaultColDef: ColDef;
  @Input() rowData: object;
  @Input() gridOptions: GridOptions = {};
  @Input() frameworkComponents: any;
  @Input() tooltipShowDelay: any;
  @Input() sizeToFit = true;
  @Input() gridLoading = true;
  @Input() context: any;
  @Input() pinnedCols: string[];
  @Input() leftPinnedCols: string[];
  @Input() suppressMovableColumns = true;
  @Input() totalDataCount: number;
  @Input() gridFrameworkComponents: any = {};
  @Input() pagination: boolean;
  @Input() serverGridPagination = true;
  @Input() paginationPageSize = 5;
  @Input() paginationId = 'paginator';
  @Input() currentPage = 1;
  @Input() totalPaginationItems: number;
  @Input() paginatorLoading: boolean;
  @Input() showSearch: boolean;
  @Input() infoScreen: boolean;
  @Input() showLoading = true;
  @Input() rowSelection: any;
  @Input() emptyRowsMessage = 'DEFAULT_EMPTY_ROWS_MESSAGE';
  @Input() detailCellRendererParams: any;
  @Output() gridReady = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
  @Output() searchReady = new EventEmitter<FormControl>();
  @Output() rowSelected = new EventEmitter();

  timeEnd = 0;
  dataLoaded = false;
  loadBtnDisabled = false;
  noRowsTemplate: string;
  loadingTemplate: string;
  gridAPI: GridApi;
  columnAPI: ColumnApi;
  searchControl: FormControl;
  constructor() {
    this.rowSelection = 'multiple';
    this.loadingTemplate = '<span class="ag-overlay-loading-center">chargement de source...</span>';
    this.noRowsTemplate = '<span>chargement de source...</span>';
  }

  ngOnInit() {
    if (this.showLoading) {
      this.gridOptions.loadingOverlayComponent = 'loadingOverlayComponent';
      this.gridFrameworkComponents.loadingOverlayComponent = CustomLoadingOverlayComponent;
    }
    // pagination
    if (!this.currentPage) {
      this.currentPage = 1;
    }
    this.gridOptions.onRowDataChanged = (dataChangedEvent: RowDataChangedEvent) => {
      if (this.gridAPI && this.sizeToFit) {
        this.gridAPI.sizeColumnsToFit();
      }
    };
  }

  onGridReady(event: GridReadyEvent) {
    this.gridReady.emit(event);
    this.gridLoading = false;
    this.gridAPI = event.api;
    this.columnAPI = event.columnApi;
    if (this.pinnedCols) {
      this.pinnedCols.forEach((col: string) => {
        if (this.columnAPI.getColumn(col)) {
          this.columnAPI.setColumnPinned(col, 'right');
        }
      });
    }
    if (this.leftPinnedCols) {
      this.leftPinnedCols.forEach((col: string) => {
        if (this.columnAPI.getColumn(col)) {
          this.columnAPI.setColumnPinned(col, 'left');
        }
      });
    }
    if (this.sizeToFit) {
      this.gridAPI.sizeColumnsToFit();
    }
  }

  onWindowResize() {
    if (this.sizeToFit) {
      this.gridAPI.sizeColumnsToFit();
    }
  }

  onSearchFilterChange(event: Event | any) {
    this.gridAPI.setQuickFilter(event.target.value);
  }

  ngAfterViewInit() {
    this.searchReady.emit(this.searchControl);
  }

  ngOnDestroy() {}

  onRowSelected(event: any) {
    this.rowSelected.emit(event);
  }
}
