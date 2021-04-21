import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18nService, I18n } from '@shared/services/custom-datepicker-i18n.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  @Input() singleSelect: Boolean = false;
  @Input() expand: Boolean = false;

  @Output() pageChanged = new EventEmitter();
  @Output() singleSelectionEvent = new EventEmitter();
  @Output() multipleSelectionEvent = new EventEmitter();

  dropdownSettings: IDropdownSettings;
  key: string;
  rangeDates: Date[];
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  selectedRows: any[];
  form: FormGroup;
  constructor(calendar: NgbCalendar, public formBuilder: FormBuilder) {
    this.fromDate = calendar.getToday();
  }

  ngOnInit(): void {
    this.data = this.data.slice(0, 5);
    this.key = this.columns[0]['field'];
    this.form = this.formBuilder.group({});
    this.initForm(this.columns);
    console.log(this.form.value);
    this.columns = this.columns.filter((col) => {
      if (Object.keys(col).indexOf('isVisible') == -1 || col.isVisible) {
        return col;
      } else {
        this.form.removeControl(col.field);
      }
    });

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
  }

  onPageChange(event: any) {
    console.log(event);
  }

  filterHeader($event: Event) {
    // @ts-ignore
    console.log($event.target.value);
  }

  initForm(colomns: any[]) {
    this.columns.forEach((col) => {
      if (col.filter) {
        this.form.addControl(col.field, new FormControl('', []));
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

  update(columns: any[]) {
    this.columns = columns;
    this.ngOnInit();
  }

  onFilterChange(open: boolean) {
    if (!open) {
      console.log(this.form.value);
    }
  }
}
