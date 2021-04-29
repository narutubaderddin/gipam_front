import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18nService, I18n } from '@shared/services/custom-datepicker-i18n.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { Dropdown } from 'primeng/dropdown';

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
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18nService }],
})
export class NgDataTableComponent implements OnInit {
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
  @Output() filterValue: EventEmitter<any> = new EventEmitter();
  @Output() action: EventEmitter<any> = new EventEmitter();
  calendar_fr: any;
  @Output() pageChanged = new EventEmitter();
  @Output() sort = new EventEmitter();
  @Input() singleSelect: Boolean = false;
  @Input() expand: Boolean = false;
  @Input() page: any;
  @Input() limit: any;
  @Output() singleSelectionEvent = new EventEmitter();
  @Output() multipleSelectionEvent = new EventEmitter();
  asc: boolean = true;
  currentPage: number;
  paginationSize: number;

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

  constructor(private calendar: NgbCalendar, public formBuilder: FormBuilder) {
    this.fromDate = calendar.getToday();
  }

  ngOnInit(): void {
    console.log('columns', this.columns);
    this.key = this.columns[0]['field'];
    this.columns = this.columns.filter((col) => {
      if (Object.keys(col).indexOf('isVisible') == -1 || col.isVisible) {
        return col;
      }
    });
    this.form = this.formBuilder.group({});
    this.initForm(this.columns);
    // this.filter = Object.assign({}, this.form.value);
    // console.log('filter', this.filter);
    this.expandColumns = [
      {
        header: 'Numéro inventaire',
        field: 'id',
      },
      {
        header: '',
        field: 'select',
        type: 'app-select-button-render',
      },
    ];
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
    console.log($event.target.value);
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

  onFilterChange(open: boolean, col: any) {
    if (!open) {
      this.setFilter(col);
      const filterValue = Object.assign({}, this.form.value);
      this.filterValue.emit(this.filter);
    }
  }

  setFilter(col: any) {
    this.filter[col.field] = this.form.value[col.field];
    if (col.filterType === 'range-date') {
      this.filter[col.field + '_operator'] = this.form.value[col.field + '_operator'];
    }
  }

  sortHeader() {
    this.asc = !this.asc;
    this.sort.emit(this.asc);
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

  rangeChanged(field: string, dropdown: Dropdown, calendar?: Calendar) {
    if (dropdown.value.name === 'range') {
      this.dateSelectionMode = 'range';
      this.monthsToDisplay = 2;
      this.dateRangeMode = true;
      return;
    }
    calendar.writeValue(new Date());
    // this.form.value[field] = new Date();
    this.dateSelectionMode = 'single';
    this.dateRangeMode = false;
    this.monthsToDisplay = 1;
  }

  calendarShow(dropdown: Dropdown, field: string) {
    const fieldOperator = field + '_operator';
    if (!this.form.value[fieldOperator]) {
      this.dateSelectionMode = 'single';
      this.form.value[fieldOperator] = { name: 'eq', value: '=' };
      this.form.value[field] = new Date();
    }
  }

  clearDateFilter(field: string, calendar: Calendar, dropdown: Dropdown) {
    this.form.value[field + '_operator'] = '';
    this.form.value[field] = '';
    calendar.writeValue('');
    dropdown.writeValue({ name: 'eq', value: '=' });
    calendar.toggle();
  }

  dateFilterSubmit(event: any) {
    console.log(this.form.valid);
    const filter = {
      'startDate[lt]': '12/12/2020',
      'endDate[lt]': '12/12/2020',
    };
  }
}
