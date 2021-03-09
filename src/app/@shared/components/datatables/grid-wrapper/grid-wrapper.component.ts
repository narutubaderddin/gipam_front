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
  @Input() rowData: any;
  @Input() gridOptions: GridOptions = {};
  @Input() frameworkComponents: any;
  @Input() tooltipShowDelay: any;
  @Input() sizeToFit = true;
  @Input() gridLoading = true;
  @Input() context: any;
  @Input() pinnedCols: string[];
  @Input() leftPinnedCols: string[];
  @Input() suppressMovableColumns = true;
  @Input() totalDataCount: number = 10;
  @Input() gridFrameworkComponents: any = {};
  @Input() pagination: boolean = true;
  @Input() serverGridPagination = true;
  @Input() paginationPageSize = 5;
  @Input() paginationId = 'paginator';
  @Input() currentPage = 1;
  @Input() totalPaginationItems: number = 10;
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
  rowCount: number = 5;
  paginationSize: number = 5;
  from: number = 1;
  to: number = 5;
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
    console.log(this.paginationSize);
    this.gridOptions.onRowDataChanged = (dataChangedEvent: RowDataChangedEvent) => {
      this.handlePaginationInfo();
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

  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
    this.gridAPI.paginationSetPageSize(Number(this.rowCount));
  }

  onPageChanged(page: number) {
    // this.gridAPI.showLoadingOverlay();
    // this.currentPage = page;
    // this.pageChanged.emit(page);
  }

  private handlePaginationInfo() {
    this.currentPage = this.currentPage ? this.currentPage : 1;
    // calculate from data index
    const from = (this.currentPage - 1) * this.paginationSize + 1;
    this.from = this.rowData.length && from ? from : 1;
    // calculate to data index
    const to = this.currentPage * this.paginationSize;
    this.to = this.rowData.length === this.paginationSize && to ? to : this.totalPaginationItems;
  }
}
