import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowDataChangedEvent } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-wrapper',
  templateUrl: './grid-wrapper.component.html',
  styleUrls: ['./grid-wrapper.component.scss'],
})
export class GridWrapperComponent implements OnInit {
  @Input() columnDefs: ColDef[];
  @Input() defaultColDef: ColDef;
  @Input() rowData: object;
  @Input() frameworkComponents: any;
  @Input() tooltipShowDelay: any;
  @Input() sizeToFit = true;

  @Output() gridReady = new EventEmitter<any>();
  timeEnd = 0;
  dataLoaded = false;
  loadBtnDisabled = false;
  rowSelection: string;
  noRowsTemplate: string;
  loadingTemplate: string;
  gridAPI: GridApi;
  columnAPI: ColumnApi;

  constructor() {
    this.rowSelection = 'multiple';
    this.loadingTemplate = '<span class="ag-overlay-loading-center">chargement de source...</span>';
    this.noRowsTemplate = '<span>chargement de source...</span>';
  }

  ngOnInit() {}

  onGridReady(event: GridReadyEvent) {
    this.gridReady.emit(event);
    this.gridAPI = event.api;
    this.columnAPI = event.columnApi;
  }
  onModelUpdated(e: any) {
    this.loadBtnDisabled = false;
    if (!this.dataLoaded) {
      this.dataLoaded = true;
      this.timeEnd = new Date().getTime();
    }
  }
  onWindowResize() {
    if (this.sizeToFit) {
      this.gridAPI.sizeColumnsToFit();
    }
  }
}
