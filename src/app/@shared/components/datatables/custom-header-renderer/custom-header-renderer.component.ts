import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnFilterModel } from '@app/@shared/models/column-filter-model';
import { TYPES, OPERATORS } from '@app/@shared/services/column-filter.service';
import { NgbDropdown, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-custom-header-renderer',
  templateUrl: './custom-header-renderer.component.html',
  styleUrls: ['./custom-header-renderer.component.scss'],
})
export class CustomHeaderRendererComponent implements IHeaderAngularComp {
  @ViewChild('dropdown', { read: NgbDropdown, static: true }) dropdown: NgbDropdown;
  @ViewChild('inputField', { read: ElementRef, static: false }) inputField: ElementRef;
  @ViewChild('selectField', { read: ElementRef, static: false }) selectField: ElementRef;
  params: IHeaderParams;
  menuIcon: string;
  operator: string;
  filterControl = new FormControl('');
  parentComponent: any;
  filterActive: boolean;
  field: string;
  type: string;
  list: string[];
  resetFilter: boolean;
  gridId: string;
  sortOrder: string;

  constructor(public sharedService: SharedService) {}
  get placeholder() {
    return `filter ${this.field}`;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: IHeaderParams | any): void {
    this.params = params;
    this.menuIcon = params.menuIcon;
    this.operator = params.operator;
    this.field = params.column.getColId();
    this.type = params.type;
    this.list = params.list;
    this.resetFilter = params.resetFilter;
    this.parentComponent = this.params.context.parentComponent;
    this.gridId = params.gridId;
  }

  onFilterClick(dropdown: NgbDropdown) {
    dropdown.toggle();
    if (this.inputField) {
      setTimeout(() => this.inputField.nativeElement.focus());
    }
  }

  onFilterEnter(dropdown?: NgbDropdown) {
    this.parentComponent.updateFilteredData(this.getFilters(), this.gridId);
    this.filterActive = this.filterControl.value;
    if (dropdown) {
      dropdown.close();
    }
  }

  onFilterInput(event: any) {
    if (this.field === 'currency' || this.field === 'incoterm') {
      this.filterControl.setValue(event.target.value.toUpperCase());
    }
  }

  onResetFilter() {
    this.parentComponent.resetFilter();
  }

  getFilters(): ColumnFilterModel[] {
    let filters: ColumnFilterModel[];
    if (this.type === TYPES.date) {
      filters = [
        {
          column: this.field,
          operator: OPERATORS.equalsOrSuperior,
          value: `${this.sharedService.NgbDateToString(this.filterControl.value)} 00:00:00`,
        },
        {
          column: this.field,
          operator: OPERATORS.equalsOrInferior,
          value: `${this.sharedService.NgbDateToString(this.filterControl.value)} 23:59:59`,
        },
      ];
    } else if (this.type === TYPES.list) {
      const value = this.filterControl.value ? [this.filterControl.value] : this.list;
      filters = [
        {
          column: this.field,
          operator: this.operator,
          value,
        },
      ];
    } else {
      filters = [
        {
          column: this.field,
          operator: this.operator,
          value: this.filterControl.value,
        },
      ];
    }
    return filters;
  }

  onDateSelection(date: NgbDate) {
    this.filterControl.setValue(date);
    this.onFilterEnter();
  }

  onSortColumn(order: string) {
    console.log(order);

    this.sortOrder = order;
    this.parentComponent.updateSortedData(this.field, order);
    console.log(this.field);
  }
}
