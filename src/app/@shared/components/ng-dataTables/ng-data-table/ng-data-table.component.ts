import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18nService, I18n } from '@shared/services/custom-datepicker-i18n.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { Dropdown } from 'primeng/dropdown';
import { DatePipe } from '@angular/common';
import { viewDateFormat } from '@shared/utils/helpers';
import { SortIcon } from 'primeng/table';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state(
        'void',
        style({
          transform: 'translateX(-10%)',
          opacity: 0,
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18nService }, DatePipe],
})
export class NgDataTableComponent implements OnInit {
  @Input() error = false;
  @Input() errorMessage = 'Une erreur technique est survenue';
  @Input() noDataMessage = 'Aucun élément à afficher';
  @Input() loading = false;
  @Input() columns: any[];
  @Input() expandColumns: any[] = [];
  @Input() frozenCols: any[] = [];
  @Input() data: any[] = [];
  @Input() start: number = 1;
  @Input() end: number = 5;
  @Input() totalFiltred: number = 10;
  @Input() total: number = 10;
  @Input() checkBoxSelection: Boolean = false;
  @Input() frozenWidth: string = '250px';
  @Input() component: string;
  @Input() sortMeta: [{ field: 'label'; order: -1 }, { field: 'field'; order: -1 }];
  @Output() filterValue: EventEmitter<any> = new EventEmitter();
  @Output() action: EventEmitter<any> = new EventEmitter();
  calendar_fr: any;
  @Output() pageChanged = new EventEmitter();
  @Output() sort = new EventEmitter();
  @Input() singleSelect: Boolean = false;
  @Input() expand: Boolean = false;
  @Input() showConfirmRequest: Boolean = false;
  @Input() page: any;
  @Input() limit: any;
  @Input() identifierKey: any;
  @Output() singleSelectionEvent = new EventEmitter();
  @Output() multipleSelectionEvent = new EventEmitter();
  @Output() changeRequestStatus = new EventEmitter();
  asc: boolean = true;
  currentPage: number;
  paginationSize: number;
  @Output() filterChange = new EventEmitter();

  dropdownSettings: IDropdownSettings;
  key: string;
  rangeDates: Date[];
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  selectedRows: any[];
  form: FormGroup;
  dateFilterRange: { from: any; to: any; operator: any } = { from: null, to: null, operator: null };
  selectedCol: any;
  selectedOperator: any;
  dateRangeMode = false;
  monthsToDisplay = 1;
  dateSelectionMode = 'single';
  dateOperators: any[] = [
    { name: 'eq', value: '=' },
    { name: 'lt', value: '<' },
    { name: 'gt', value: '>' },
    { name: 'lte', value: '<=' },
    { name: 'gte', value: '>=' },
    { name: 'range', value: 'intervalle' },
  ];
  filter: any = {};
  filterFormValues: any = {};

  viewDateFormat = viewDateFormat;

  constructor(
    private calendar: NgbCalendar,
    public formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private simpleTabsRefService: SimpleTabsRefService
  ) {
    this.fromDate = calendar.getToday();
  }

  ngOnInit(): void {
    this.key = this.columns[0]['field'];
    if (this.identifierKey) {
      this.key = this.identifierKey;
    }

    this.columns = this.columns.filter((col) => {
      if (Object.keys(col).indexOf('isVisible') == -1 || col.isVisible) {
        return col;
      } else if (this.form && this.form.value && Object.keys(this.form.value).indexOf(col.field) != -1) {
        this.form.removeControl(col.field);
      }
    });
    this.form = this.formBuilder.group({});
    this.initForm(this.columns);
    this.filterFormValues = Object.assign({}, this.form.value);
    // console.log('filter', this.filter);
    // this.expandColumns = [
    //   {
    //     header: 'Numéro inventaire',
    //     field: 'id'
    //   },
    //   {
    //     header: '',
    //     field: 'select',
    //     type: 'app-select-button-render'
    //   }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      allowSearchFilter: true,
    };
    // pagination
    if (!this.currentPage) {
      this.currentPage = 1;
    }
  }

  onChangePage(event: any) {
    this.pageChanged.emit(event);
    this.currentPage = event.page + 1;
    this.paginationSize = event.rows;
    this.currentPage = this.currentPage ? this.currentPage : 1;
    // calculate from data index
    const from = event.first + 1;
    this.start = (this.currentPage - 1) * this.paginationSize && from ? from : 1;
    // calculate to data index
    const to = this.currentPage * this.paginationSize;
    this.end = Math.min(to, this.total);
  }

  filterHeader($event: Event) {
    // @ts-ignore
    // console.log(this.form.value);
    this.filterValue.emit(this.form.value);
  }

  initForm(colomns: any[]) {
    this.columns.forEach((col) => {
      if (col.filter) {
        this.form.addControl(col.field, new FormControl('', []));
        if (col.filterType === 'range-date') {
          const colOperatorKey = col.field + '_operator';
          this.form.addControl(colOperatorKey, new FormControl('', []));
        }
      }
    });
  }

  onItemSelect($event: ListItem) {}

  onSelectAll($event: Array<ListItem>) {}

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onRadioSelect(event: NgDataTableComponent) {
    this.singleSelectionEvent.emit(event);
  }

  onCheckBoxSelection(event: any) {
    this.multipleSelectionEvent.emit(event);
  }

  onChange() {}

  actionMethod(e: any) {
    this.action.emit(e);
  }

  update(columns: any[]) {
    this.columns = columns;
    this.ngOnInit();
  }

  updateData(data: any[]) {
    this.data = data;
    this.ngOnInit();
  }

  // onFilterChange(open: boolean) {
  //   if (!open) {
  //     this.filterChange.emit(this.form.value);
  //   }
  // }

  sortHeader(sortIcon: SortIcon, column: any) {
    let dir;
    if (sortIcon.sortOrder === 1) {
      dir = 'asc';
    } else {
      dir = 'desc';
    }
    const sort = {
      sort_by: column.field,
      sort: dir,
    };
    if (column.type === 'key-array') {
      sort.sort_by = column.key_data[0] + '_' + column.key_data[1];
    }
    this.sort.emit(sort);
  }

  handlePaginationInfo() {
    this.currentPage = this.currentPage ? this.currentPage : 1;
    // calculate from data index
    const from = (this.currentPage - 1) * this.limit + 1;
    this.start = this.data.length && from ? from : 1;
    // calculate to data index
    const to = this.currentPage * this.limit;
    this.end = this.data.length === this.limit && to ? to : this.total;
  }

  onFilterChange(open: boolean, col: any) {
    if (!open) {
      this.setFilter(col);
      console.log(this.filter);
      this.filterValue.emit(this.filter);
    }
  }

  setFilter(column: any) {
    // here filterFormValues has the values of the form used for the filter because
    // in some cases the form in the date picker is initialised
    if (column.filterType === 'text') {
      this.filterFormValues[column.field] = this.form.value[column.field];
    }
    if (column.filterType === 'range-date') {
      this.filterFormValues[column.field] = this.form.value[column.field];
      this.filterFormValues[column.field + '_operator'] = this.form.value[column.field + '_operator'];
    }
    this.columns.forEach((col) => {
      if (col.filter && this.form.value[col.field]) {
        if (col.filterType === 'range-date') {
          this.getDateFilter(col);
        } else {
          this.filter[col.field] = {
            value: this.form.value[col.field],
            type: col.filterType,
            field_type: col.type,
          };
        }
      } else {
        delete this.filter[col.field];
      }
      if (Array.isArray(this.form.value[col.field]) && this.form.value[col.field].length === 0) {
        delete this.filter[col.field];
      }
    });
  }

  getDateFilter(col: any) {
    if (
      (!this.filterFormValues[col.field + '_operator'] && !this.filterFormValues[col.field]) ||
      !this.filterFormValues[col.field]
    ) {
      return;
    }
    let operator = this.filterFormValues[col.field + '_operator'].name;
    if (!this.filterFormValues[col.field + '_operator']) {
      operator = 'eq';
    }
    if (operator !== 'range') {
      this.filter[col.field] = {
        value: this.datePipe.transform(this.filterFormValues[col.field], 'yyyy-MM-dd'),
        operator,
        type: col.filterType,
      };
      return;
    }
    if (
      operator === 'range' &&
      Array.isArray(this.filterFormValues[col.field]) &&
      this.filterFormValues[col.field].length === 2
    ) {
      const date1 = this.datePipe.transform(this.filterFormValues[col.field][0], 'yyyy-MM-dd');
      const date2 = this.datePipe.transform(this.filterFormValues[col.field][1], 'yyyy-MM-dd');
      if (!date1 || !date2) {
        // the user could select one date for the range mode so we discard his changes
        return;
      }
      this.filter[col.field] = {
        value: [date1, date2],
        operator,
        type: col.filterType,
      };
      return;
    }
    return;
  }

  rangeChanged(field: string, dropdown: Dropdown, calendar: Calendar) {
    if (dropdown.value.name === 'range') {
      this.dateSelectionMode = 'range';
      this.form.value[field + '_operator'] = dropdown.value;
      this.monthsToDisplay = 2;
      return;
    }
    // this.form.value[field] = new Date();
    this.dateSelectionMode = 'single';
    if (Array.isArray(this.filterFormValues[field])) {
      calendar.writeValue(new Date());
      this.form.value[field] = new Date();
      this.form.value[field + '_operator'] = dropdown.value;
      this.filterFormValues[field + '_operator'] = this.form.value[field + '_operator'];
    }
    this.form.value[field] = calendar.value;
    this.filterFormValues[field] = this.form.value[field];
    this.form.value[field + '_operator'] = dropdown.value;
    this.filterFormValues[field + '_operator'] = this.form.value[field + '_operator'];
    this.monthsToDisplay = 1;
  }

  calendarShow(calendar: Calendar, dropdown: Dropdown, field: string) {
    const fieldOperator = field + '_operator';
    if (!this.filterFormValues[fieldOperator]) {
      calendar.writeValue(new Date());
      this.form.value[field] = new Date();
      this.filterFormValues[field] = new Date();
      this.dateSelectionMode = 'single';
      dropdown.writeValue({ name: 'eq', value: '=' });
      this.form.value[fieldOperator] = { name: 'eq', value: '=' };
      this.filterFormValues[fieldOperator] = { name: 'eq', value: '=' };
      return;
    }
    this.form.value[fieldOperator] = dropdown.value;
    this.filterFormValues[fieldOperator] = dropdown.value;
  }

  clearDateFilter(field: string, calendar: Calendar, dropdown: Dropdown) {
    this.form.value[field + '_operator'] = '';
    this.filterFormValues[field + '_operator'] = '';
    this.form.value[field] = '';
    this.filterFormValues[field] = '';
    calendar.writeValue('');
    dropdown.writeValue({ name: 'eq', value: '=' });
    calendar.toggle();
  }

  onDataChange(event: any, tab: string, index: number) {
    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    apiData['search'] = event.query;
    this.simpleTabsRefService.getItemsByCriteria(apiData, tab).subscribe((dataResult) => {
      this.columns[index].selectData = this.getTabRefData(dataResult['results']);
    });
  }
  getTabRefData(result: any[]) {
    let items: any[] = [];
    result.forEach((item: any) => {
      if (item.hasOwnProperty('label')) {
        items.push({ id: item.id, name: item.label });
      } else {
        items.push({ id: item.id, name: item.name });
      }
    });
    return items;
  }
  onChangeRequestStatus(requestID: any, status: any) {
    console.log('requestID');
    console.log(requestID);
    const newRequest = {
      id: requestID,
      requestStatus: status,
    };
    this.changeRequestStatus.emit(newRequest);
  }
}
